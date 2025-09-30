import { useState } from "react";
import { useAxios } from "./useAxios";
import { HTTPErrorType } from "@/shared/types/error";
import { UploadDataParams } from "@/shared/types/request";
import RNToast from "react-native-toast-message";
import { ViewStyle } from "react-native";

export const useGenericSet = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<HTTPErrorType>(null);
  const [success, setSuccess] = useState(false);
  const [resData, setResData] = useState<any>({});
  const { set } = useAxios();

  const showErrorToast = (message: string | object): void => {
    const formattedMessage =
    typeof message === "string" ? message : JSON.stringify(message);

    RNToast.show({
      position: "bottom",
      bottomOffset: 44,
      text1: formattedMessage,
      autoHide: false,
      props: {
        timer: 5,
        styles: {
          backgroundColor: "orange",
        } as ViewStyle,
      },
    });
  };

  const uploadData = async (options: UploadDataParams) => {
    const {
      api,
      id,
      data,
      params,
      method,
      type,
      dataCallback,
      headers,
      loader,
    } = options;

    setError(null);
    setSuccess(false);
    
    await set({
      api: id ? `${api}${id}` : api,
      errorHandler: (res: HTTPErrorType) => {
        console.log("useGenericSet Error", res)
        if (res?.statusCode === 400) showErrorToast(res?.message as string);
        setError(res);
        setSuccess(false);
      },
      successHandler: (res: any) => {
        if (dataCallback) {
          dataCallback(res);
        } else {
          setResData(res);
        }
        setSuccess(true);
      },
      methodName: method || "post",
      params,
      data,
      type,
      loader: loader ? loader : setSubmitting,
      headers,
    });
  };

  const updateErrors = (err: HTTPErrorType) => {
    setError(err ? { ...error, ...err } : null);
  };

  return {
    submitting,
    error,
    resData,
    success,
    uploadData,
    updateErrors,
    setError,
  };
};

export default useGenericSet;
