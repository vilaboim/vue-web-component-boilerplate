# Vue Web Component Boilerplate

## Boilerplate to generate a web component based on Vue using Webpack and @vue/web-component-wrapper

### How to build your component

- Put your components inside `src` folder

- Run `yarn build --component=App`

- Go to the `dist` folder to check your web component

### Options

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`--component`**|`{String}`|`App`|Name of your component|
|**`--libName`**|`{String}`|`App`|Name of your library|
|**`--externalize`**|`{Boolean}`|`false`|Externalize Vue|
