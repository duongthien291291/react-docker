import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const checkMouseOnLeft = (e) => {
  const target = e.target;
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  return x <= rect.width / 2;
};

const RatingStar = ({ ...props }) => {
  const { index } = props;
  const state = useContext(RatingV3Context);
  const dispatch = useContext(RatingV3DispatchContext);

  const empltyStar = process.env.PUBLIC_URL + "/images/icons8-star-24.png";
  const filledStar =
    process.env.PUBLIC_URL + "/images/icons8-star-filled-24.png";
  const haftEmptyStar =
    process.env.PUBLIC_URL + "/images/icons8-star-half-empty-24.png";

  const source =
    state.value >= index
      ? filledStar
      : state.value + 0.5 === index
      ? haftEmptyStar
      : empltyStar;

  const onMouseMove = (e, type = "update_value") => {
    updateValue(e, type);
  };

  const onMouseDown = (e, type = "update_selected_value") => {
    updateValue(e, type);
  };

  const updateValue = (e, type = "onHoverStar" | "onClickStar") => {
    const mouseOnLeft = checkMouseOnLeft(e);
    const newValue = mouseOnLeft ? index - 0.5 : index;
    dispatch({ type, value: newValue });
  };

  return (
    <img
      src={source}
      width={50}
      onMouseMove={(e) => onMouseMove(e)}
      onMouseDown={(e) => onMouseDown(e)}
      alt="star"
    />
  );
};

const createInitialState = (ratingValue) => {
  const value = Number(ratingValue) ?? 0;
  return { value, selectedValue: value };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "update_value": {
      return { ...state, value: action.value };
    }
    case "update_selected_value": {
      return { ...state, selectedValue: action.value };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};

export const RatingV3Context = createContext(null);
export const RatingV3DispatchContext = createContext(null);

export const RatingV3Provider = ({ children, ...props }) => {
  const { ratingValue } = props;
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(ratingValue)
  );

  return (
    <RatingV3Context.Provider value={state}>
      <RatingV3DispatchContext.Provider value={dispatch}>
        {children}
      </RatingV3DispatchContext.Provider>
    </RatingV3Context.Provider>
  );
};

const RatingStarList = () => {
  const [starsList] = useState([1, 2, 3, 4, 5]);
  const [value, setValue] = useState(0);
  const state = useContext(RatingV3Context);
  const dispatch = useContext(RatingV3DispatchContext);

  useEffect(() => {
    setValue(state.value);
  }, [state.value]);

  const onLeaveRating = () => {
    if (state.value !== state.selectedValue)
      dispatch({ type: "update_value", value: state.selectedValue });
  };

  return (
    <>
      <span onMouseLeave={onLeaveRating}>
        {starsList.map((star) => (
          <RatingStar index={star} key={star}></RatingStar>
        ))}
      </span>
      <div>Hover value {value}</div>
    </>
  );
};

const RatingValue = () => {
  const state = useContext(RatingV3Context);

  return <div>Value {state.selectedValue}</div>;
};

const RatingV3 = ({ children, ...props }) => {
  const { ratingValue } = props;

  return (
    <div>
      <RatingV3Provider ratingValue={ratingValue}>
        <RatingStarList></RatingStarList>
        <RatingValue></RatingValue>
      </RatingV3Provider>
    </div>
  );
};

export default RatingV3;
