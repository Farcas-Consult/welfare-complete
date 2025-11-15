{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 -- Welfare Management System Database Seed Data\
-- This script populates the database with initial required data.\
\
-- 1. Insert a default Membership Plan\
INSERT INTO membership_plans (id, name, code, description, monthly_contribution, registration_fee, max_loan_multiple, min_contribution_months, is_active)\
VALUES \
    ('a0000000-0000-4000-a000-000000000001', 'Standard Plan', 'STANDARD', 'The basic membership plan with standard benefits.', 500.00, 1000.00, 3, 6, TRUE)\
ON CONFLICT (code) DO NOTHING;\
\
-- Variable to store the ID of the default plan\
DO $$ \
DECLARE\
    standard_plan_id UUID := 'a0000000-0000-4000-a000-000000000001';\
    admin_member_id UUID;\
    admin_user_id UUID;\
BEGIN\
    -- 2. Insert the Default Admin Member\
    INSERT INTO members (first_name, last_name, email, phone_primary, member_no, status, plan_id, kyc_status)\
    VALUES (\
        'System', \
        'Admin', \
        'admin@welfare.com', \
        '+254700000000', \
        'ADM001', \
        'active', \
        standard_plan_id, \
        TRUE\
    )\
    ON CONFLICT (email) DO UPDATE SET updated_at = CURRENT_TIMESTAMP\
    RETURNING id INTO admin_member_id;\
\
    -- 3. Insert the Default Admin User\
    -- Using the pgcrypto extension (enabled in init.sql) to hash the password 'Admin@123'.\
    INSERT INTO users (member_id, username, email, password_hash, role, is_active, email_verified)\
    VALUES (\
        admin_member_id, \
        'admin', \
        'admin@welfare.com', \
        crypt('Admin@123', gen_salt('bf', 8)),\
        'admin', \
        TRUE,\
        TRUE\
    )\
    ON CONFLICT (email) DO UPDATE SET updated_at = CURRENT_TIMESTAMP\
    RETURNING id INTO admin_user_id;\
    \
    -- 4. Set the KYC verification details using the new admin user ID\
    UPDATE members \
    SET kyc_verified_by = admin_user_id, kyc_verified_at = CURRENT_TIMESTAMP\
    WHERE id = admin_member_id;\
\
    -- 5. Insert initial System Settings\
    INSERT INTO system_settings (category, key, value, value_type, description)\
    VALUES \
        ('GENERAL', 'SYSTEM_NAME', 'Welfare Management System', 'string', 'The name of the system.'),\
        ('FINANCE', 'DEFAULT_PLAN_ID', 'a0000000-0000-4000-a000-000000000001', 'uuid', 'ID of the default membership plan.'),\
        ('LOANS', 'MAX_LOAN_AMOUNT', '500000.00', 'decimal', 'Maximum loan amount allowed.'),\
        ('LOANS', 'LOAN_SERVICE_FEE', '5.00', 'decimal', 'Default loan service fee percentage.')\
    ON CONFLICT (category, key) DO NOTHING;\
\
END $$;}