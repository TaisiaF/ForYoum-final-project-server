const getPagination = (
    page = 1,  //ערכי ברירת-מחדל
    limit = 10
) => {

    page = Number(page);
    limit = Number(limit);

    const skip =    //כמות האיברים שמדלגים עליהם כדי להגיע לאיבר הנוחכי שיש להציג
        (page - 1) * limit;  //example: Page 2: (2 - 1) \times 10 = 10. (Skip the first 10 items, show items 11–20)

    return {
        page,
        limit,
        skip
    };
};

export default getPagination;
