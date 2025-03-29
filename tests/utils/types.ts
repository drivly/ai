export interface ApiResponse {
  api: {
    name: string;
    description: string;
    home: string;
    login: string;
    signup: string;
    admin: string;
    docs: string;
    repo: string;
    with: string;
    from: string;
    [key: string]: string;
  };
  links?: Record<string, any>;
  [key: string]: any;
}

export interface ApiError {
  error: boolean;
  message: string;
  stack?: string[];
}
