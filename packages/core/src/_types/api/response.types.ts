type ResponseType = {
  httpCode: number;
  status: string;
};

type ErrorResponseType = ResponseType & {
  message?: string;
  onlyError?: boolean;
  errorPath?: string;
};

type DataResponseType<DataType> = ResponseType & {
  data?: DataType;
  onlyData?: boolean;
};

export type ServiceResponseType<DataType> = DataResponseType<DataType> & ErrorResponseType;
