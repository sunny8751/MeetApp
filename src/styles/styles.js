import colors, { colorSchemes, defaultColorScheme } from './colors';
import { Platform } from 'react-native';

export const header = {
    backgroundColor: colors.white
}

export const text = {
    color: defaultColorScheme.darkColor,
    fontSize: 20
};

export const timeText = {
    ...text,
    paddingBottom: 5
}

export const verticalCenter = {
    justifyContent: 'center',
}

export const horizontalCenter = {
    alignItems: 'center',
}

export const center = {
    ...verticalCenter,
    ...horizontalCenter
}

export const horizontalLayout = {
    flexDirection: 'row'
}

export const flex = {
    flex: 1
}

export const leftRightView = {
    ...horizontalLayout,
    justifyContent: 'space-between'
}

export const centerRight = {
    marginLeft: "auto",
    marginTop: "auto",
    marginBottom: "auto"
}

export const shadow = {
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowColor: defaultColorScheme.darkColor,
    shadowOffset: { height: 3, width: 3 },
};

export const sectionTitle = {
    ...text,
    color: defaultColorScheme.mediumColor,
    textAlign: 'center',
    marginTop: 10
};

export const cardContainer = {
    // ...shadow,
    // backgroundColor: colors.lightblue,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
    padding: 15,
    borderRadius: 15
};

export const cardSubheaderText = {
    ...text,
    fontWeight: 'bold',
    fontSize: 16
    // color: colors.white,
};

export const logoText = {
    // color: colors.green,
    fontWeight: 'bold',
    fontSize: 35,
    marginTop: -10,
    paddingBottom: 50,
}

export const cardHeaderText = {
    ...cardSubheaderText,
    fontWeight: 'bold',
    fontSize: 26,
    paddingBottom: 5,
    // color: colors.darkblue
};

export const cardLocationText = {
    ...cardSubheaderText,
    fontSize: 16,
    // color: colors.mediumblue
};

export const addButton = {
    bottom: 30,
    padding: 15,
    borderRadius: 50,
    alignSelf: 'center',
    backgroundColor: colors.lightgreen
}

export const addButtonFloating = {
    ...addButton,
    // ...shadow,
    position: 'absolute',
    paddingLeft: 60,
    paddingRight: 60,
}

export const headerView = {
    ...flex,
    padding: 15,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
}

export const headerText = {
    color: defaultColorScheme.darkColor,
    fontSize: 22,
    fontWeight: 'bold'
}

export const headerTitle = {
    ...headerText,
    color: defaultColorScheme.darkColor,
    textAlign: 'left',
    fontSize: 26,
    fontWeight: 'bold',
    paddingTop: 15
}

export const headerFinishComponent = {
    ...headerText,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10
}

export const headerButton = {
    backgroundColor: defaultColorScheme.mediumColor,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
}

export const switchText = {
    ...text,
    fontWeight: 'bold',
}

export const inputText = {
    color: colors.black
}

export const extraBottomSpace = {
    paddingBottom: 100
}

export {
    colors,
    colorSchemes,
    defaultColorScheme
};