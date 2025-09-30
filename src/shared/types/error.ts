export type ErrorBase<T> = {
  type: string;
  message: string;
  trace: unknown;
  params?: T;
};

export type SimpleError = ErrorBase<never>;

export type HTTPErrorType = {
  message?: string;
  name?: string;
  statusCode?: number;
} | null;

export type FormValidatorType = {
  field: string;
  notValid?: string | null;
  required?: Boolean;
};

export type SetErrorType = (value: HTTPErrorType) => void;
