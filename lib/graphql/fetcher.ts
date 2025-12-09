import type { DocumentNode } from 'graphql';
import { print } from 'graphql';

export async function graphQLFetcher<T>(query: string | DocumentNode, variables?: Record<string, unknown>): Promise<T> {
  const queryString = typeof query === 'string' ? query : print(query);
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: queryString, variables })
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }
  return json.data as T;
}
