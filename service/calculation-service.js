class CalculationService {
    //расчитываем общий объем
    size = (diameter, height) => {
        const value = 3.14 * ((diameter / 2) * (diameter / 2)) * height;
        return value;
    };
    //расчитываем площадь поверхности
    square = (diameter, height) => {
        const value =
            2 * 3.14 * (diameter / 2) * height +
            3.14 * ((diameter / 2) * (diameter / 2));
        return value;
    };
    //расчитываем количество крема
    amountCream = (cakeWeightUpToTight, standWeight, leveledCakeWeight) => {
        const value = leveledCakeWeight - standWeight - cakeWeightUpToTight;
        return value;
    };
    //расчитываем количество мастики
    amountMastic = (weightOfCoveredCake, leveledCakeWeight) => {
        const value = weightOfCoveredCake - leveledCakeWeight;
        return value;
    };
}

module.exports = new CalculationService();
