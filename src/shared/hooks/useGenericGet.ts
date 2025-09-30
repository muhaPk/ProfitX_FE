import { useState } from "react";
import { useAxios } from "./useAxios";
import { LoadDataParams, TGenericGet } from "@/shared/types/request";

export const useGenericGet = (): TGenericGet => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(null);
  const [resData, setResData] = useState<any>();
  const { get } = useAxios();

  const loadData = async (options: LoadDataParams) => {
    const {
      api,
      isExternal,
      params,
      method,
      isRefreshing,
      headers,
      dataCallback,
      loader,
    } = options;

    if (!isRefreshing) {
      setResData(null);
    }

    await get({
      api,
      params,
      isExternal,
      loader: isRefreshing ? setRefreshing : loader ? loader : setLoading,
      errorHandler: setError,
      successHandler: (res: any) => {
        if (dataCallback) {
          dataCallback(res);
        } else {
          setResData(res);
        }
      },
      methodName: method,
      headers,
    });
  };

  return { loading, refreshing, error, data: resData, loadData };
};
