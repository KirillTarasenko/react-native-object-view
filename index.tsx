import _ from "lodash";
import React, { PureComponent } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  booleanStyle: {
    color: "#1B00D1",
  },
  keyStyle: {
    color: "#313A42",
  },
  nullStyle: {
    color: "#818181",
  },
  numberStyle: {
    color: "#1B00D1",
  },
  stringStyle: {
    color: "#C41A17",
  },
  undefinedStyle: {
    color: "#818181",
  },
  valueStyle: {
    color: "#313A42",
  },
});

const paths: string[] = [];

const generatedInfo = ({
  keyName,
  devObject,
}: {
  keyName?: string;
  devObject: any;
}) =>
  `[PATH]: ${paths.join(
    "."
  )}.${keyName}\n[KEY]: ${keyName}\n[VALUE]: ${JSON.stringify(devObject)}`;

const DEFAULT_INIT_EXPAND_DEPTH = 0;
const DEFAULT_MARGIN_LEFT = 5;

type IPressParams = { key?: string; value: any; info: string };

type IProps = {
  autoExpandDepth?: number;
  keyName?: string;
  onLongPressKey?: ({ key, value, info }: IPressParams) => void;
  onLongPressValue?: ({ key, value, info }: IPressParams) => void;
  marginLeft?: number;
  devObject: any;
};

type IState = {
  isOpen: boolean;
};

export default class DevObjectView extends PureComponent<IProps, IState> {
  static defaultProps = {
    keyName: "object",
    marginLeft: DEFAULT_MARGIN_LEFT,
  };

  constructor(props: IProps) {
    super(props);
    this.state = { isOpen: false };
  }

  toggleOpen = () => {
    const { keyName, autoExpandDepth = DEFAULT_INIT_EXPAND_DEPTH } = this.props;
    const innerLevel = autoExpandDepth * -1;
    if (innerLevel > 0.5) {
      if (innerLevel <= paths.length) {
        paths.length = innerLevel - 1;
      }
      paths.push(String(keyName));
    }
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  handlePressKey = () => {
    const { onLongPressKey, keyName, devObject } = this.props;
    const infoText = generatedInfo({ keyName, devObject });
    onLongPressKey?.({
      key: keyName,
      value: devObject,
      info: infoText,
    });
  };
  handlePressValue = () => {
    const { onLongPressValue, keyName, devObject } = this.props;
    onLongPressValue?.({
      key: keyName,
      value: devObject,
      info: generatedInfo({ keyName, devObject }),
    });
  };

  renderField = (value: any) => {
    if (value === null) {
      return <Text style={styles.nullStyle}>{String(value)}</Text>;
    }
    switch (typeof value) {
      case "string":
        return <Text style={styles.stringStyle}>{`"${value}"`}</Text>;
      case "boolean":
        return <Text style={styles.booleanStyle}>{String(value)}</Text>;
      case "number":
        return <Text style={styles.numberStyle}>{value}</Text>;
      case "undefined":
        return <Text style={styles.undefinedStyle}>{String(value)}</Text>;
      default:
        return <Text style={styles.valueStyle}>{String(value)}</Text>;
    }
  };

  renderEmptyObjectRow = () => {
    const { keyName, devObject, marginLeft } = this.props;
    const emptyObjectText = _.isArray(devObject) ? "[]" : "{}";
    return (
      <Text style={{ marginLeft }}>
        <TouchableOpacity onLongPress={this.handlePressKey}>
          <Text style={styles.keyStyle}>{`${keyName}:`}</Text>
        </TouchableOpacity>
        <Text style={styles.valueStyle}>{` ${emptyObjectText}`}</Text>
      </Text>
    );
  };

  renderClosedObjectRow = () => {
    const { keyName, marginLeft } = this.props;
    return (
      <View style={{ marginLeft }}>
        <Text style={styles.keyStyle} onPress={this.toggleOpen}>
          {`${keyName}: +`}
        </Text>
      </View>
    );
  };

  renderObjectRow = () => {
    const { isOpen } = this.state;
    const {
      autoExpandDepth = DEFAULT_INIT_EXPAND_DEPTH,
      keyName,
      devObject,
      marginLeft,
    } = this.props;

    if (_.isObject(devObject) && _.isEmpty(devObject)) {
      return this.renderEmptyObjectRow();
    }
    const autoExpandDepthRemaining = autoExpandDepth - 1;

    if (autoExpandDepthRemaining < 0 && !isOpen) {
      return this.renderClosedObjectRow();
    }

    const subComponents = _.map(devObject, (subValue, subkey) => (
      <DevObjectView
        {...this.props}
        autoExpandDepth={autoExpandDepthRemaining}
        keyName={subkey}
        devObject={subValue}
        onLongPressKey={this.handlePressKey}
        key={`${keyName}:${subkey}`}
      />
    ));

    return (
      <View style={{ marginLeft }}>
        <Text style={styles.keyStyle} onPress={this.toggleOpen}>
          {`${keyName}: -`}
        </Text>
        {subComponents}
      </View>
    );
  };

  render() {
    const { keyName, devObject, marginLeft } = this.props;

    if (_.isObject(devObject)) {
      return this.renderObjectRow();
    }

    return (
      <Text style={{ marginLeft }}>
        <Text style={styles.keyStyle} onLongPress={this.handlePressKey}>
          {`${keyName}:`}
        </Text>
        <Text style={styles.valueStyle} onLongPress={this.handlePressValue}>
          {this.renderField(devObject)}
        </Text>
      </Text>
    );
  }
}
