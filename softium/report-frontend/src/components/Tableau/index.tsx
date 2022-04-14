import React, { useEffect, useRef, useState } from 'react';
import { getReportUrl } from '@/services/tableau';
import ReactDOM from 'react-dom';
import { TABLEAU_CONFIG } from '@/components/Tableau/TableauConfig';
import storage from '@/utils/storage';
export interface TableauProps
  extends React.DetailedHTMLProps<
    React.IframeHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
  > {
  tablePath: string;
  filter?: {
    [key: string]: string;
  };
}

const Tableau: React.FC<TableauProps> = ({
  tablePath,
  filter,
  ...iframeProps
}) => {
  const [reportUrl, setReportUrl] = useState<string>();
  const filterStr = Object.entries(filter || TABLEAU_CONFIG).reduce((a, b) => {
    return `${a}&${b[0]}=${b[1]}`;
  }, '');
  useEffect(() => {
    getReportUrl(tablePath).then(res => {
      setReportUrl(res.data);
    });
  }, []);

  if (reportUrl) {
    return (
      <>
        <iframe
          id={'tableauContainer'}
          src={reportUrl + filterStr}
          frameBorder={0}
          {...iframeProps}
        />
      </>
    );
  }

  return null;
};

export default Tableau;
