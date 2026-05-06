import { useRef, useState } from "react";
import { Helmet } from "react-helmet";

import RandomChar from "../components/randomChar/RandomChar";
import CharList from "../components/charList/CharList";
import CharInfo from "../components/charInfo/CharInfo";
import CharSearchForm from "../components/charSearchForm/CharSearchForm";
import ErrorBoundary from "../components/errorBoundary/ErrorBoundary";

import decoration from "@assets/img/vision.png";

const MainPage = () => {
  const [char, setChar] = useState(null);

  const onCharSelected = (id) => {
    setChar(id);
  };

  const targetRef = useRef(null);

  const onScrollToInfo = () => {
    targetRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Helmet>
        <meta name="description" content="Marvel information portal" />
        <title>Marvel information portal</title>
      </Helmet>
      <ErrorBoundary>
        <RandomChar />
      </ErrorBoundary>
      <div className="char__content">
        <ErrorBoundary>
          <CharList
            onCharSelected={onCharSelected}
            onScrollToInfo={onScrollToInfo}
          />
        </ErrorBoundary>
        <div>
          <ErrorBoundary>
            <CharInfo charId={char} charTarget={targetRef} />
          </ErrorBoundary>
          <ErrorBoundary>
            <CharSearchForm />
          </ErrorBoundary>
        </div>
      </div>
      <img className="bg-decoration" src={decoration} alt="vision" />
    </>
  );
};

export default MainPage;
