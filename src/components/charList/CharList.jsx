import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import useMarvelService from "@services/useMarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";
import { useEffect, useRef, useState } from "react";

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllCharacters } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset).then(onCharListLoaded);
  };

  const onCharListLoaded = async (newCharList) => {
    let ended = false;
    if (newCharList.length < 6) {
      ended = true;
    }
    setCharList([...charList, ...newCharList]);
    setNewItemLoading(false);
    setOffset(offset + 6);
    setCharEnded(ended);
  };

  const itemRefs = useRef([]);

  const focusOnItem = (id) => {
    itemRefs.current.forEach((item) =>
      item.current.classList.remove("char__item_selected"),
    );
    itemRefs.current[id].current.classList.add("char__item_selected");
    itemRefs.current[id].current.focus();
  };

  function renderItems(arr) {
    const items = arr.map((item, i) => {
      if (!itemRefs.current[i]) {
        itemRefs.current[i] = React.createRef();
      }
      return (
        <CSSTransition
          key={item.id}
          timeout={500}
          classNames="char__item"
          nodeRef={itemRefs.current[i]}
        >
          <li
            className="char__item"
            tabIndex={0}
            ref={itemRefs.current[i]}
            onClick={() => {
              props.onCharSelected(item.id);
              focusOnItem(i);
              props.onScrollToInfo()
            }}
            onKeyPress={(e) => {
              if (e.key === " " || e.key === "Enter") {
                props.onCharSelected(item.id);
                focusOnItem(i);
              }
            }}
          >
            <img
              src={item.thumbnail}
              alt={item.name}
              style={{ objectFit: "cover" }}
            />
            <div className="char__name">{item.name}</div>
          </li>
        </CSSTransition>
      );
    });

    return (
      <ul className="char__grid">
        <TransitionGroup component={null}>{items}</TransitionGroup>
      </ul>
    );
  }

  const items = renderItems(charList);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;
  const content = !(loading || error) ? items : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {content}
      <button
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        className="button button__long"
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default CharList;
