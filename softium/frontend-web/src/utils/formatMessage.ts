import { getIntl, getLocale } from '@@/plugin-locale/localeExports';
import { FormatXMLElementFn, PrimitiveType } from 'intl-messageformat';
import * as React from 'react';

export default function formatMessage(
  id: string,
  values?: Record<string, PrimitiveType>,
) {
  return getIntl(getLocale()).formatMessage({ id }, values);
}

export function formatHTML(
  id: string,
  values?: Record<
    string,
    PrimitiveType | React.ReactElement | FormatXMLElementFn
  >,
) {
  return getIntl(getLocale()).formatMessage({ id }, values);
}
