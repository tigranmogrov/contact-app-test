import { LocationQuery } from 'vue-router';

interface Query {
  [key: string]: string | number | Record<string, string | number>;
}

export const useTransformQuery = (): ((query: LocationQuery) => Query) => {
  return (query: LocationQuery): Query => {
    const transformed: Query = {};

    for (const key in query) {
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        const value = query[key];

        const matches = key.match(/(.*)\[(.*)\]/);

        if (matches && matches.length === 3) {
          const parentKey = matches[1];
          const nestedKey = matches[2];

          if (!transformed[parentKey]) {
            transformed[parentKey] = {};
          }

          if (typeof value === 'string') {
            (transformed[parentKey] as Record<string, string>)[nestedKey] = JSON.parse(value);
          }
        } else {
          if (typeof value !== 'string') continue;
          transformed[key] = JSON.parse(value);
        }
      }
    }

    return transformed;
  };
};
