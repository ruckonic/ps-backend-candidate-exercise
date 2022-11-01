import taxRates from './data/taxRate.json'
import { CalculateCost } from './libs/calculate-cost'
import { getPageTitle } from './utils/pages-title'

const TaxRateDic = Object.fromEntries(taxRates.map(tx => [tx.country, tx]))

/**
 * Get site titles of cool websites.
 *
 * Task: Can we change this to make the requests async so they are all fetched at once then when they are done, return all
 * the titles and make this function faster?
 *
 * @returns array of strings
 */
export async function returnSiteTitles(): Promise<string[]> {
  const urls = [
    'https://patientstudio.com/',
    'https://www.startrek.com/',
    'https://www.starwars.com/',
    'https://www.neowin.net/'
  ]

  const titlesPromises = urls.map(getPageTitle)
  const titles = await Promise.all(titlesPromises)

  return titles.sort()
}

/**
 * Count the tags and organize them into an array of objects.
 *
 * Task: That's a lot of loops; can you refactor this to have the least amount of loops possible.
 * The test is also failing for some reason.
 *
 * @param localData array of objects
 * @returns array of objects
 */
export function findTagCounts(localData: SampleDateRecord[]): TagCounts[] {
  const tagCounts: Record<string, TagCounts> = {}

  const tags = localData.flatMap(data => data.tags)

  tags.forEach(tag => {
    const tagCount = tagCounts?.[tag]?.count ?? 0

    tagCounts[tag] = {
      tag: tag,
      count: tagCount + 1
    }
  })

  return Object.values(tagCounts)
}

/**
 * Calcualte total price
 *
 * Task: Write a function that reads in data from `importedItems` array (which is imported above) and calculates the total price, including taxes based on each
 * countries tax rate.
 *
 * Here are some useful formulas and infomration:
 *  - import cost = unit price * quantity * importTaxRate
 *  - total cost = import cost + (unit price * quantity)
 *  - the "importTaxRate" is based on they destiantion country
 *  - if the imported item is on the "category exceptions" list, then no tax rate applies
 * @deprecated
 */
export function calcualteImportCost(importedItems: ImportedItem[]): ImportCostOutput[] {
  // please write your code in here.
  // note that `taxRate` has already been imported for you
  return calculateImportCost(importedItems)
}

export function calculateImportCost(importedItems: ImportedItem[]): ImportCostOutput[] {
  return importedItems.map(({ name, unitPrice, countryDestination, category, quantity }) => {
    const countryTax = TaxRateDic[countryDestination]
    const calculateCost = new CalculateCost().setUnitPrice(unitPrice).setItemsQuantity(quantity)

    if (!countryTax.categoryExceptions.includes(category)) {
      calculateCost.setTax(countryTax.importTaxRate)
    }

    return {
      name,
      importCost: calculateCost.getImportCost(),
      subtotal: calculateCost.getSubtotal(),
      totalCost: calculateCost.getTotal()
    }
  })
}
