import colors, { colorSchemes } from './colors';
import { Platform } from 'react-native';

export const header = {
    backgroundColor: colors.white
}

export const text = {
    color: colors.black,
    fontSize: 20
};

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
    shadowColor: colors.black,
    shadowOffset: { height: 3, width: 3 },
};

export const sectionTitle = {
    ...text,
    color: colors.grey,
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
    color: colors.black,
    fontSize: 22,
    fontWeight: 'bold'
}

export const headerTitle = {
    ...headerText,
    color: colors.black,
    textAlign: 'left',
    fontSize: 26,
    fontWeight: 'bold',
    paddingTop: 15
}

export const headerButton = {
    backgroundColor: colors.grey,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
}

export const switchText = {
    ...text,
    fontWeight: 'bold',
}

export const extraBottomSpace = {
    paddingBottom: 100
}

export {
    colors,
    colorSchemes
};