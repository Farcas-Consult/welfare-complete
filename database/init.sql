-- Welfare Management System Database Schema
-- Version 1.0.0

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE IF NOT EXISTS member_status AS ENUM ('active', 'inactive', 'suspended', 'deceased');
CREATE TYPE IF NOT EXISTS payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'cancelled');
CREATE TYPE IF NOT EXISTS claim_type AS ENUM ('bereavement', 'medical', 'emergency');
CREATE TYPE IF NOT EXISTS claim_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed', 'completed');
CREATE TYPE IF NOT EXISTS loan_status AS ENUM ('application', 'approved', 'disbursed', 'active', 'completed', 'defaulted', 'written_off');
CREATE TYPE IF NOT EXISTS meeting_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE IF NOT EXISTS user_role AS ENUM ('member', 'treasurer', 'secretary', 'committee', 'admin', 'auditor');
CREATE TYPE IF NOT EXISTS notification_channel AS ENUM ('email', 'sms', 'whatsapp', 'in_app');

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_no VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    national_id VARCHAR(50) UNIQUE,
    passport_no VARCHAR(50),
    phone_primary VARCHAR(20) NOT NULL,
    phone_secondary VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    date_of_birth DATE,
    gender VARCHAR(10),
    occupation VARCHAR(100),
    employer VARCHAR(255),
    physical_address TEXT,
    postal_address VARCHAR(255),
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status member_status DEFAULT 'active',
    plan_id UUID,
    kyc_status BOOLEAN DEFAULT false,
    kyc_verified_at TIMESTAMP,
    kyc_verified_by UUID,
    profile_photo_url TEXT,
    qr_code TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membership Plans
CREATE TABLE IF NOT EXISTS membership_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    monthly_contribution DECIMAL(10, 2) NOT NULL,
    registration_fee DECIMAL(10, 2) DEFAULT 0,
    benefits JSONB DEFAULT '{}',
    max_loan_multiple INTEGER DEFAULT 3,
    min_contribution_months INTEGER DEFAULT 6,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dependents
CREATE TABLE IF NOT EXISTS dependents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    national_id VARCHAR(50),
    phone VARCHAR(20),
    is_beneficiary BOOLEAN DEFAULT false,
    benefit_percentage DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'member',
    is_active BOOLEAN DEFAULT true,
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(255),
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh Tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contributions/Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status payment_status DEFAULT 'pending',
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    balance DECIMAL(10, 2),
    late_fee DECIMAL(10, 2) DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, period_year, period_month)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_ref VARCHAR(100) UNIQUE NOT NULL,
    invoice_id UUID REFERENCES invoices(id),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    channel VARCHAR(50),
    channel_ref VARCHAR(255),
    status payment_status DEFAULT 'pending',
    paid_at TIMESTAMP,
    reconciled BOOLEAN DEFAULT false,
    reconciled_at TIMESTAMP,
    reconciled_by UUID,
    receipt_no VARCHAR(50),
    receipt_url TEXT,
    raw_payload JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claims
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_no VARCHAR(50) UNIQUE NOT NULL,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    beneficiary_id UUID REFERENCES dependents(id),
    claim_type claim_type NOT NULL,
    amount_requested DECIMAL(10, 2) NOT NULL,
    amount_approved DECIMAL(10, 2),
    reason TEXT NOT NULL,
    status claim_status DEFAULT 'draft',
    submitted_at TIMESTAMP,
    submitted_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    disbursed_at TIMESTAMP,
    disbursed_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claim Documents
CREATE TABLE IF NOT EXISTS claim_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claim Approvals Workflow
CREATE TABLE IF NOT EXISTS claim_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
    approver_id UUID REFERENCES users(id),
    approval_level INTEGER NOT NULL,
    decision VARCHAR(20) NOT NULL,
    amount_approved DECIMAL(10, 2),
    comments TEXT,
    decided_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disbursements
CREATE TABLE IF NOT EXISTS disbursements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_no VARCHAR(100) UNIQUE NOT NULL,
    claim_id UUID REFERENCES claims(id),
    loan_id UUID,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    destination_account VARCHAR(255),
    destination_name VARCHAR(255),
    transaction_ref VARCHAR(255),
    status payment_status DEFAULT 'pending',
    disbursed_at TIMESTAMP,
    disbursed_by UUID REFERENCES users(id),
    proof_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan Products
CREATE TABLE IF NOT EXISTS loan_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    max_amount DECIMAL(10, 2),
    max_multiple_of_contribution INTEGER DEFAULT 3,
    min_tenure_months INTEGER DEFAULT 3,
    max_tenure_months INTEGER DEFAULT 12,
    service_fee_percentage DECIMAL(5, 2) DEFAULT 5.00,
    requires_guarantors BOOLEAN DEFAULT false,
    min_guarantors INTEGER DEFAULT 0,
    min_contribution_months INTEGER DEFAULT 6,
    max_active_loans INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    terms_and_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loans
CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_no VARCHAR(50) UNIQUE NOT NULL,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    product_id UUID REFERENCES loan_products(id),
    principal_amount DECIMAL(10, 2) NOT NULL,
    service_fee DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    tenure_months INTEGER NOT NULL,
    monthly_installment DECIMAL(10, 2) NOT NULL,
    purpose TEXT,
    status loan_status DEFAULT 'application',
    application_date DATE DEFAULT CURRENT_DATE,
    approved_date DATE,
    approved_by UUID REFERENCES users(id),
    disbursed_date DATE,
    disbursed_by UUID REFERENCES users(id),
    expected_completion_date DATE,
    actual_completion_date DATE,
    outstanding_balance DECIMAL(10, 2),
    total_paid DECIMAL(10, 2) DEFAULT 0,
    next_payment_date DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan Guarantors
CREATE TABLE IF NOT EXISTS loan_guarantors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    guarantor_member_id UUID REFERENCES members(id),
    guarantee_amount DECIMAL(10, 2) NOT NULL,
    accepted BOOLEAN DEFAULT false,
    accepted_at TIMESTAMP,
    rejection_reason TEXT,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan Repayments
CREATE TABLE IF NOT EXISTS loan_repayments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id),
    installment_no INTEGER NOT NULL,
    due_date DATE NOT NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    principal_amount DECIMAL(10, 2) NOT NULL,
    service_fee_amount DECIMAL(10, 2) DEFAULT 0,
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    paid_date DATE,
    status payment_status DEFAULT 'pending',
    days_overdue INTEGER DEFAULT 0,
    penalties DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meetings
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_no VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_type VARCHAR(50) NOT NULL,
    committee VARCHAR(100),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER,
    location VARCHAR(255),
    is_virtual BOOLEAN DEFAULT false,
    virtual_link TEXT,
    virtual_provider VARCHAR(50),
    virtual_meeting_id VARCHAR(255),
    virtual_password VARCHAR(50),
    status meeting_status DEFAULT 'scheduled',
    quorum_required INTEGER,
    actual_attendance INTEGER,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    recording_url TEXT,
    transcript_url TEXT,
    minutes_url TEXT,
    created_by UUID REFERENCES users(id),
    chaired_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meeting Agenda Items
CREATE TABLE IF NOT EXISTS meeting_agenda_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    item_no INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    presenter_id UUID REFERENCES users(id),
    time_allocated_minutes INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meeting Attendees
CREATE TABLE IF NOT EXISTS meeting_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id),
    invited BOOLEAN DEFAULT true,
    attended BOOLEAN DEFAULT false,
    join_time TIMESTAMP,
    leave_time TIMESTAMP,
    attendance_duration_minutes INTEGER,
    apology_sent BOOLEAN DEFAULT false,
    apology_reason TEXT,
    proxy_member_id UUID REFERENCES members(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(meeting_id, member_id)
);

-- Meeting Minutes
CREATE TABLE IF NOT EXISTS meeting_minutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    key_decisions JSONB DEFAULT '[]',
    action_items JSONB DEFAULT '[]',
    prepared_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    distributed BOOLEAN DEFAULT false,
    distributed_at TIMESTAMP,
    distributed_to JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Action Items from Meetings
CREATE TABLE IF NOT EXISTS action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES members(id),
    due_date DATE,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'pending',
    completed_at TIMESTAMP,
    completion_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID REFERENCES members(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    channel notification_channel NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id),
    actor_ip INET,
    actor_user_agent TEXT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    value_type VARCHAR(20) DEFAULT 'string',
    description TEXT,
    is_sensitive BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, key)
);

-- Create indexes
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_member_no ON members(member_no);
CREATE INDEX idx_members_phone ON members(phone_primary);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_invoices_member_period ON invoices(member_id, period_year, period_month);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payments_member ON payments(member_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_paid_at ON payments(paid_at);
CREATE INDEX idx_claims_member ON claims(member_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_loans_member ON loans(member_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_meetings_date ON meetings(scheduled_date);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO welfare_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO welfare_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO welfare_user;
