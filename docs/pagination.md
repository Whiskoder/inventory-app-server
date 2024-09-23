## Filtering, Sorting and Pagination

### Query parameters

#### Pagination

- `limit`: A limit on the number of objects to be returned. Limit can range between 1 and 100, and the **default limit is _10_**.
- `page`: The page number for pagination and the **default page is _1_**.

#### Sorting

- `sortBy`: The property key by which the results should be sorted, **default key is _"id"_**.
- `orderBy`: The order in which the `sortBy` results should be sorted (`asc` or `desc`), **default order is _"asc"_**.

#### Filtering

- `key[lte]=value` - Less than or equal to `value`.
- `key[gte]=value` - Greater than or equal to `value`.
- `key[exists]=true` - Exists (`true` or `false`).
- `key[regex]=value` - Regular expression match.
- `key[before]=value` - Before a specific `timestamp` in ISO format.
- `key[after]=value` - After a specific `timestamp` in ISO format.
