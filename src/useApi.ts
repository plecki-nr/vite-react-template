import { useState, useCallback } from "react";
import { get as getAll, post, put, remove as removeItem } from './api';

const useApi = <T>() => {
    const [data, setData] = useState<T>();
    const [isLoading, setIsLoading] = useState(false);
    const [shouldGet, setShouldGet] = useState(false);
    const [error, setError] = useState<string | null>(null);



    const get = async (endpoint: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getAll(endpoint);
            setData(result);
            setShouldGet(false)
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const add = async (endpoint: string, item: T) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await post(endpoint, item);
            setData(prevData => [...prevData, result]);
            setShouldGet(true)
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const update = async (endpoint: string, id: string, item: T) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await put(endpoint, id, item);
            setData(prevData => prevData.map(dataItem => (dataItem['id'] === id ? result : dataItem)));
            setShouldGet(true)
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const remove = async (endpoint: string, id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await removeItem(endpoint, id);
            setData(prevData => prevData.filter(dataItem => dataItem['id'] !== id));
            setShouldGet(true)
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        data,
        shouldGet,
        isLoading,
        error,
        get,
        add,
        update,
        remove,
    };
};

export default useApi;