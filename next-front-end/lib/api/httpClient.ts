import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from "axios";
import AxiosInstance, { ApiError, type ApiErrorDetails } from "./axiosInstance";

// Generic GET request function with type checking
export async function fetchData<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    params,
  };

  try {
    const response: AxiosResponse<T> = await AxiosInstance.get(path, config);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        error: string;
        message?: string;
        code?: string;
        details?: ApiErrorDetails;
      }>;

      throw new ApiError(
        axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          "An unexpected error occurred",
        axiosError.response?.status,
        axiosError.response?.data?.code || axiosError.code,
        axiosError.response?.data?.details
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}

// Generic POST request function with type checking
export async function postData<TReq, TRes>(
  path: string,
  data: TReq,
  params?: Record<string, string>
): Promise<TRes> {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    params,
  };

  try {
    const response: AxiosResponse<TRes> = await AxiosInstance.post(
      path,
      data,
      config
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        error: string;
        message?: string;
        code?: string;
        details?: ApiErrorDetails;
      }>;

      throw new ApiError(
        axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          "An unexpected error occurred",
        axiosError.response?.status,
        axiosError.response?.data?.code || axiosError.code,
        axiosError.response?.data?.details
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}

// Generic PUT request function with type checking
export async function putData<TReq, TRes>(
  path: string,
  data: TReq,
  params?: Record<string, string>
): Promise<TRes> {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    params,
  };

  try {
    const response: AxiosResponse<TRes> = await AxiosInstance.put(
      path,
      data,
      config
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        error: string;
        message?: string;
        code?: string;
        details?: ApiErrorDetails;
      }>;

      throw new ApiError(
        axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          "An unexpected error occurred",
        axiosError.response?.status,
        axiosError.response?.data?.code || axiosError.code,
        axiosError.response?.data?.details
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}

// Generic DELETE request function with type checking
export async function deleteData<TReq, TRes>(
  path: string,
  _data?: TReq,
  params?: Record<string, string>
): Promise<TRes> {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    params,
  };

  try {
    const response: AxiosResponse<TRes> = await AxiosInstance.delete(
      path,
      config
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        error: string;
        message?: string;
        code?: string;
        details?: ApiErrorDetails;
      }>;

      throw new ApiError(
        axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          "An unexpected error occurred",
        axiosError.response?.status,
        axiosError.response?.data?.code || axiosError.code,
        axiosError.response?.data?.details
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}
