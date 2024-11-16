
# Image Caption Auto Generator

An intelligent tool to automatically generate captions for images using OpenAI's language models. The package comes with built-in caching and rate limiting to optimize performance and manage API usage effectively.

## Table of Contents

* Installation
* Usage
  * CommonJS
  * ES Modules
* Configuration
  * CaptionConfig Options
    * Supported Language Codes
* Features
  * Caching
  * Rate Limiting
* Example
* Disclaimer
* License

## Installation

Install the package via npm:

**npm** **install** **image-caption-auto-generator**

## Usage

### CommonJS

**const** **{** generateImageCaption **}** = **require**(**'image-caption-auto-generator'**)**;**

**(**async** **(**)** **=>** **{**

**  **try** **{

**    **const** **caption** = **await** **generateImageCaption**(**'**https://example.com/image.jpg**'**, **{

**      **apiKey**: **process**.**env**.OPENAI_API_KEY,**

**      **context**: **'e-commerce'**,**

**      **language**: **'en'**,**

**      **maxLength**: **100**,**

**      **cacheDuration**: **3600**,**

**      **rateLimitDuration**: **3600**,**

**      **rateLimitPoints**: **10**,**

**    **}**)**;

**    **console**.**log**(**'Caption:'**, **caption**)**;

**  **}** **catch** **(**error**)** **{

**    **console**.**error**(**'Error generating caption:'**, **error**)**;

**  **}

**}**)**(**)**;**

### ES Modules

**import** **{** **generateImageCaption** **}** **from** **'image-caption-auto-generator'**;

**(**async** **(**)** **=>** **{**

**  **try** **{

**    **const** **caption** = **await** **generateImageCaption**(**'**https://example.com/image.jpg**'**, **{

**      **apiKey**: **process**.**env**.OPENAI_API_KEY,**

**      **context**: **'e-commerce'**,**

**      **language**: **'en'**,**

**      **maxLength**: **100**,**

**      **cacheDuration**: **3600**,**

**      **rateLimitDuration**: **3600**,**

**      **rateLimitPoints**: **10**,**

**    **}**)**;

**    **console**.**log**(**'Caption:'**, **caption**)**;

**  **}** **catch** **(**error**)** **{

**    **console**.**error**(**'Error generating caption:'**, **error**)**;

**  **}

**}**)**(**)**;**

## Configuration

The `generateImageCaption` function accepts two parameters:

* **`imageUrl`** (`string`): The URL of the image for which you want to generate a caption.
* **`config`** (`CaptionConfig`): An object containing configuration options.

### CaptionConfig Options

| Option                | Type        | Description                                                                              | Default       |
| --------------------- | ----------- | ---------------------------------------------------------------------------------------- | ------------- |
| `apiKey`            | `string`  | Your OpenAI API key.**Required** .                                                 |               |
| `context`           | `string`  | The context or style for the caption (e.g.,`'e-commerce'`, `'fashion'`, `'blog'`). | `'general'` |
| `language`          | `string`  | The language code for the caption. Supported languages are listed below.                 | `'en'`      |
| `maxLength`         | `number`  | Maximum length of the generated caption.                                                 | `100`       |
| `cacheDuration`     | `number`  | Duration in seconds to cache captions. Set to `0` to disable caching.                  | `3600`      |
| `disableCache`      | `boolean` | Set to `true` to disable caching.                                                      | `false`     |
| `rateLimitDuration` | `number`  | Time frame in seconds for the rate limit window.                                         | `3600`      |
| `rateLimitPoints`   | `number`  | Maximum number of allowed requests within the `rateLimitDuration`.                     | `10`        |

#### Supported Language Codes

The `language` option accepts the following codes:

* `'en'` (English)
* `'es'` (Spanish)
* `'fr'` (French)
* `'de'` (German)
* `'ja'` (Japanese)
* `'zh'` (Chinese)
* `'he'` (Hebrew)
* `'it'` (Italian)
* `'nl'` (Dutch)
* `'pl'` (Polish)
* `'pt'` (Portuguese)
* `'ru'` (Russian)
* `'ar'` (Arabic)
* `'cs'` (Czech)
* `'da'` (Danish)
* `'fi'` (Finnish)
* `'el'` (Greek)
* `'hi'` (Hindi)
* `'hu'` (Hungarian)
* `'id'` (Indonesian)
* `'ko'` (Korean)
* `'no'` (Norwegian)
* `'fa'` (Persian)
* `'ro'` (Romanian)
* `'sv'` (Swedish)
* `'th'` (Thai)
* `'tr'` (Turkish)
* `'uk'` (Ukrainian)
* `'vi'` (Vietnamese)

## Features

### Caching

The package includes an in-memory caching mechanism to store generated captions for a specified duration (`cacheDuration`). This helps reduce redundant API calls to OpenAI and improves response times for repeated requests.

* **Cache Key** : The combination of `imageUrl` and `language` is used as the cache key.
* **Disabling Cache** : You can disable caching by setting `disableCache` to `true` in the configuration.

### Rate Limiting

Built-in rate limiting is provided to control the number of requests made within a certain time frame, preventing abuse and excessive API usage.

* **Configuration** : Controlled via `rateLimitPoints` and `rateLimitDuration`.
* **Per-Image Rate Limiting** : Rate limits are applied based on the `imageUrl`.

## Example

Here's an example of using the package within an Express server:

**// server.js**

**const** express = **require**(**'express'**)**;**

**const** **{** generateImageCaption **}** = **require**(**'image-caption-auto-generator'**)**;**

**require**(**'dotenv'**)**.**config**(**)**;**

**const** **app** = **express**(**)**;

**app**.**get**(**'/api/caption'**, **async** **(**req**, **res**)** **=>** **{**

**  **try** **{

**    **const** **caption** = **await** **generateImageCaption**(**

**      **'**https://gratisography.com/wp-content/uploads/2024/**10/gratisography-cool-cat-800x525.jpg**'**,

**      **{

**        **apiKey**: **process**.**env**.OPENAI_API_KEY,**

**        **context**: **'e-commerce'**, **// Context related to a fashion e-commerce website

**        **language**: **'en'**,**

**        **maxLength**: **100**,**

**        **cacheDuration**: **3600**,       **// Cache captions for 1 hour

**        **rateLimitDuration**: **3600**,   **// Rate limit window of 1 hour

**        **rateLimitPoints**: **10**,       **// Max 10 requests per image per hour

**      **}

**    **)**;**

**    **console**.**log**(**'Caption:'**, **caption**)**;

**    **res**.**send**(**{** **caption** **}**)**;

**  **}** **catch** **(**error**)** **{

**    **console**.**error**(**'Error generating caption:'**, **error**)**;

**    **res**.**status**(**500**)**.**send**(**{** **error**: **'Failed to generate caption'** **}**)**;**

**  **}

**}**)**;**

**const** **PORT** = **process**.**env**.PORT || **3000**;

**app**.**listen**(**PORT**, **(**)** **=>** **{

**  **console**.**log**(**`Server is running on port **${**PORT**}**`**)**;

**}**)**;**

 **Note** :

* Ensure you have your OpenAI API key set in your `.env` file or environment variables.
* Replace the image URL with the URL of the image you want to caption.

## Disclaimer

 **Please note** : While this package aims to generate accurate and contextually appropriate captions for images, it does not guarantee the correctness or suitability of the generated captions. The author of this package is not responsible for any inaccuracies or unintended results produced by the use of this package. Users should review and verify the generated captions before using them in any critical or public-facing applications.

## License

This project is licensed under the ISC License.

The ISC License is an open-source license that allows for free use, modification, and distribution of the software, including in commercial applications. It is functionally equivalent to the MIT License and is approved by the Open Source Initiative (OSI).
