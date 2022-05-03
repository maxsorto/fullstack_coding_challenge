module.exports = {
  content: ['./index.html', './src/**/*.{vue,js}'],
  plugins: [],
  theme: {
    fontFamily: {
      sans: 'Helvetica Now, sans-serif',
      serif: 'Helvetica Now, serif',
    },
    extend: {
      colors: {
        transparent: 'transparent',
      },
      width: {
        '1/7': '14.285714%',
        '2/7': '28.571428%',
        '3/7': '42.857142%',
        '4/7': '57.142856%',
        '5/7': '71.42857%',
        '6/7': '85.714284%',
        '1/9': '11.111111%',
        '2/9': '22.222222%',
        '3/9': '33.333333%',
        '4/9': '44.444444%',
        '5/9': '55.555555%',
        '6/9': '66.666666%',
        '7/9': '77.777777%',
        '8/9': '88.888888%',
      },
      boxShadow: {
        widget: '0px 4px 32px 0px #00000021',
      },
    },
  },
};
