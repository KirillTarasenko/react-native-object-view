# react-native-object-view
Rendering JSON-object as react-native component. It can be helpful for dev-menu.

## Installation
```npm install react-native-object-view``` or ```yarn add react-native-object-view```


# react-native-object-view
![](https://github.com/KirillTarasenko/react-native-object-view/blob/main/example/ex.gif)


## How to use

### Example
```js
import DevObjectView from 'react-native-object-view';

...
<DevObjectView
        keyName={'root'} // optional
        devObject={{}} // require: any object
      />
```

### Example use with Alert
```js
import DevObjectView from 'react-native-object-view';
import { Alert } from 'react-native';

...

const FAKE_DATA = {
  arrayExm: [1, 2, 3],
  booleanExm: true,
  stringExm: 'test string',
  func: () => {},
  objectExm: { b: { c: { d: 'hello world' }, f: { h: false } } },
};

  handleSaveKey = props => {
    Alert.alert('Callback onLongPressKey', JSON.stringify(props));
  };
  handleSaveValue = props => {
    Alert.alert('Callback onLongPressValue', JSON.stringify(props));
  };

...
<DevObjectView
        devObject={FAKE_DATA}
        autoExpandDepth={1}
        keyName={'root'}
        onLongPressKey={this.handleSaveKey}
        onLongPressValue={this.handleSaveValue}
      />
```
### Props

```devObject``` - The array or object that you want to be rendered.

```onLongPressKey``` - onLongPress by keyName. Callback param: ```({ key?: string; value: any; info: string })```

```onLongPressValue``` - onLongPress by value. Callback param: ```({ key?: string; value: any; info: string })```

```keyName``` - The key name that will be displayed. Only the initial keyName is relevant to you. Default is 'object'.

```marginLeft``` - The margin between nested objects. Adjusting this may make it more or less readable for you. Default is 5.

```value``` - The array or object that you want to be rendered.

