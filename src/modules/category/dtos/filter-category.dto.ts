import qs from 'qs'

// export interface FilterProps {
// 	lte?: number;
// 	gte?: number;
// 	exists?: boolean;
// 	regex?: string;1
// 	before?: Date;
// 	after?: Date;
// }

type LessThanEqualFilter = number
type GreaterThanEqualFilter = number
type ExistsFilter = boolean
type RegexFilter = string
type BeforeFilter = Date
type AfterFilter = Date

export class FilterCategoryDto {
  name?: RegexFilter

  price?: LessThanEqualFilter | GreaterThanEqualFilter

  public static async create(obj: {
    [key: string]: any
  }): Promise<FilterCategoryDto> {
    // const {limit, pa}
    const { name } = qs.parse(obj)
    console.log(name)

    return new FilterCategoryDto()
  }
}
