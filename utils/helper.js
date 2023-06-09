const percentageCalc=(orgP,P) => {
    return ((orgP-P)/orgP*100).toFixed(2);
}

module.exports= {percentageCalc}