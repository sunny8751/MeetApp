import colors, { colorSchemes } from './colors';

export const headerStyle = {
    backgroundColor: colors.lightblue
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

export const centerRight = {
    marginLeft: "auto",
    marginTop: "auto",
    marginBottom: "auto"
}

export const shadow = {
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    ...horizontalLayout,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
    padding: 15,
    borderRadius: 15
};

export const cardSubheaderText = {
    ...text,
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
    position: 'absolute',
    bottom: 30,
    padding: 15,
    paddingLeft: 60,
    paddingRight: 60,
    borderRadius: 50,
    alignSelf: 'center',
    backgroundColor: colors.greenUI
}

export {
    colors,
    colorSchemes
};