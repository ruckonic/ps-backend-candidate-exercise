import fetch from 'cross-fetch'

const HttpStatusCode = {
  OK: 200
}

export class PageTitleError extends Error {}

export async function getPageTitle(url: string | URL): Promise<string> {
  try {
    const response = await fetch(url)

    if (response.status !== HttpStatusCode.OK) {
      throw new PageTitleError('Bad response page')
    }

    const data = await response.text()
    const match = data.match(/<title>(?<title>.+?)<\/title>/)
    const title = match?.groups?.title

    if (!title) {
      throw new PageTitleError(`Title not fond in ${url.toString()}`)
    }

    return title
  } catch {
    throw new PageTitleError(`Can't get title for ${url.toString()}`)
  }
}
