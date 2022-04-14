import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { debounce } from 'lodash';

export default React.memo(
  ({ fetchOptions, debounceTimeout = 800, byCode, ...props }: any) => {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<any>([]);

    useEffect(() => {
      fetchOptions().then((res: any) => {
        setOptions(
          (res?.data?.list || []).map((item: any) => ({
            label: item.name,
            value: byCode ? item.code : item.id,
            ...item,
          })),
        );
      });
    }, []);

    const fetchRef = useRef(0);

    const debounceFetcher = useMemo(
      () =>
        debounce((value: string) => {
          fetchRef.current += 1;
          const fetchId = fetchRef.current;
          setOptions([]);
          setFetching(true);
          // if (value.length > 0) {
          fetchOptions(value).then((res: any) => {
            if (fetchId !== fetchRef.current) {
              return;
            }
            setOptions(
              (res?.data?.list || []).map((item: any) => ({
                label: item.name,
                value: byCode ? item.code : item.id,
                ...item,
              })),
            );
            setFetching(false);
          });
          // }
        }, debounceTimeout),
      [fetchOptions, debounceTimeout],
    );

    return (
      <Select
        showSearch
        filterOption={false}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        options={options}
        {...props}
        onSearch={debounceFetcher}
      />
    );
  },
);
