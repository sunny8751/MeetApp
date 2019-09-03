import { getDarkerColor, getLighterColor } from '../utils/Utils';

const colors = {
    white: '#ffffff',
    black: '#000000',
    transparentBlack: 'rgba(0, 0, 0, 0.3)',
    red: '#e74c3c',
    green: '#00b894',
    lightgreen: '#55efc4',
    // darkgreenUI: '#00895E',
    lightgrey: '#ededed',
    grey: '#cccaca',
    // bluishgrey: '#9caacf',
    lightblue: '#A7D6FF',
    darkblue: '#5B8ACF',
    blueScheme: '#a0c1fa',
    yellowScheme: '#fdcb6e',
    purpleScheme: '#a29bfe',
    orangeScheme: '#fab1a0',
};

const baseColorSchemes = [colors.blueScheme, colors.yellowScheme, colors.purpleScheme, colors.orangeScheme];

let colorSchemes = []
for (baseColor of baseColorSchemes) {
    colorSchemes.push({
        lightColor: getLighterColor(baseColor),
        mediumColor: baseColor,
        darkColor: getDarkerColor(baseColor)
    });
}

export { colorSchemes };

export const defaultColorScheme = {
    lightColor: getLighterColor(colors.grey),
    mediumColor: colors.grey,
    darkColor: colors.black
}

export default colors;
