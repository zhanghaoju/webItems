import React from 'react';
import Import from '@/pages/import';

const InstitutionImport: React.FC = (props: any) => {
  const state: any = props?.location?.state;
  return <Import {...props} state={state} />;
};

export default InstitutionImport;
