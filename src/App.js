import React, { useState, useEffect, useRef, useMemo } from "react";
import serializeForm from "form-serialize";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Link
} from "react-router-dom";

function App() {
  let [persons, setPersons] = useState(2);
  let doFocusRef = useRef(false);
  let focusRef = useRef();
  let formRef = useRef();
  let navigate = useNavigate();

  useEffect(() => {
    if (doFocusRef.current === false) {
      doFocusRef.current = true;
    } else {
      focusRef.current.focus();
    }
  }, [persons]);

  function handleSubmit(event) {
    event.preventDefault();
    let values = serializeForm(event.target, { hash: true }).ages.filter(
      v => v !== "UNSET"
    );
    navigate(`infected/?ages=${values.map(v => v)}`);
  }

  return (
    <div id="App">
      <div className="prelude">
        <h1>
          Social Distancing <span aria-hidden="true">🔚 🔜</span>
        </h1>
        <p>
          Many people close to me are skeptical that covid-19 is a big deal.
        </p>
        <p>
          I've made this illustration to show how{" "}
          <b>
            your action will affect you, your household, and the community
            around you
          </b>
          !
        </p>
        <p>
          {" "}
          All equations are based on the latest infection growth and fatality
          rates of the virus as of March 14, 2020.
        </p>
      </div>
      <hr />
      <form id="HouseHoldForm" ref={formRef} onSubmit={handleSubmit}>
        {Array.from({ length: persons }).map((_, index, arr) => (
          <label
            key={index}
            ref={arr.length - 1 === index ? focusRef : undefined}
          >
            <span>
              {index === 0 ? "Your age" : `Household Member ${index}`}:
            </span>{" "}
            <AgeSelect defaultValue={index < 2 ? 40 : undefined} />
          </label>
        ))}
        <button type="button" onClick={() => setPersons(persons + 1)}>
          Add another
        </button>
        <hr />
        <button type="submit">Next</button>
      </form>
    </div>
  );
}

function AgeSelect(props) {
  return (
    <select name="ages" {...props}>
      <option value="UNSET">- set an age</option>
      {Array.from({ length: 100 }).map((_, index) => (
        <option key={index}>{index}</option>
      ))}
    </select>
  );
}

////////////////////////////////////////////////////////////////////////////////
function Infection() {
  let location = useLocation();
  let navigate = useNavigate();
  let ages = parseAges(location.search);
  if (ages === null) {
    setTimeout(() => navigate("/"), []);
    return null;
  }

  return (
    <div id="App">
      <div className="prelude">
        <h1>You're Infected</h1>
        <p>
          Let's roll the dice and see if it kills any of your family. It
          probably won't.
        </p>
      </div>
      <div id="DiceRolls" className="center">
        {ages.map((age, index) => (
          <DiceRoll key={index} age={age} isMyself={index === 0} />
        ))}
      </div>
      <p>
        As expected, you probably didn't die. But <b>it's not about you</b>.
        Let's look at how many people your family is going to kill by not
        practicing social distancing.
      </p>
      <Link className="big-link" to={`/killers${location.search}`}>
        Your Kill Count ▸
      </Link>

      <hr />
      <h2>More information</h2>
      <p>
        Unless you're over 60, or are immuno-comprimised{" "}
        <i>(lots of your friends and family are!)</i> you're going to have to
        click the button a lot before you die.
      </p>
      <p>
        <b>So this is just like the flu, right?</b>
      </p>
      <p>
        <b>Not quite</b>. People have been quoting how many deaths per year
        there are for the flu (
        <a href="https://www.cdc.gov/flu/about/burden/index.html#:~:text=">
          12,000 to 61,000
        </a>
        ) to the deaths so far with coronavirus (
        <a href="https://www.cnn.com/interactive/2020/health/coronavirus-maps-and-cases/">
          ~50
        </a>
        ) in the US.
      </p>
      <p>
        To get the full story you usually have to look at more than static
        numbers. In this case, we need to look at:
      </p>
      <ul>
        <li>Fatality Rate</li>
        <li>Infection Growth Rate</li>
      </ul>
      <p>
        The flu has a general fatality rate of 0.1%
        <br />
        <b>COVID-19's fatality rate right now is 3.4%</b>
      </p>
      <p>
        <b>
          <a href="https://www.sciencealert.com/covid-19-s-death-rate-is-higher-than-thought-but-it-should-drop">
            That's 34x
          </a>
        </b>
        . The red bar here is 34 times bigger.
      </p>

      <div className="bars">
        <div className="bar covid">
          <span className="padding-adjust">COVID-19</span>
        </div>
        <div className="bar flu">
          <span className="padding-adjust">Influenza</span>
        </div>
      </div>
      <p>
        It's easy to tell this virus is worse even without all the data,{" "}
        <b>the flu doesn't completely overwhelm the health care system</b> in
        Italy each year, but{" "}
        <a href="https://www.theatlantic.com/ideas/archive/2020/03/who-gets-hospital-bed/607807/">
          that's exactly what coronavirus has done.
        </a>
      </p>
      <p>
        Some hospitals in Italy are running out of beds and ventilators and
        doctors need to decide who to treat 😞
      </p>
      <p>But still, only ~50 deaths in the US right? What's the big deal?</p>
      <p>
        The big deal is mixing a fatality rate that's 34x of the flu with
        exponential growth.
      </p>
      <h2>What you can do</h2>
      <ul>
        <li>
          Stay home and avoid crowded spaces (public transporation, bars, venues
          etc)
        </li>
        <li>Supermarket and pharmacies won't close so don't panic!</li>
        <li>
          Avoid to overcrowd supermarkets and keep 3.5-6 feet distance from
          other customers
        </li>
        <li>Don't shake hands</li>
        <li>Cover your mouth and nose when coughing/sneezing</li>
        <li>Use cashless payment methods</li>
        <li>Don't travel</li>
        <li>Wash your phone and then your hands properly</li>
        <li>Offer to help seniors by doing groceries for them! Avoid contacts though.</li>
        <li>Better, get groceries delivered home if you can</li>
      </ul>
    </div>
  );
}

// https://www.worldometers.info/coronavirus/coronavirus-age-sex-demographics/
let rates = [
  [9, 0],
  [19, 0.002],
  [29, 0.002],
  [39, 0.002],
  [49, 0.004],
  [59, 0.013],
  [69, 0.036],
  [79, 0.08],
  [79, 0.148]
];

function DiceRoll({ age, isMyself }) {
  let [state, setState] = useState("alive"); // alive, dead, rolling
  let [rolls, setRolls] = useState(0);

  let rate = useMemo(() => {
    let rate;
    for (let [maxAge, ageRate] of rates) {
      rate = ageRate;
      if (age < maxAge) break;
    }
    return rate;
  }, [age]);

  function rollDice() {
    setRolls(rolls + 1);
    setState("rolling");
  }

  useEffect(() => {
    if (state === "rolling") {
      let timer = setTimeout(() => {
        let rando = Math.random();
        if (rando <= rate) {
          setState("dead");
        } else {
          setState("alive");
        }
      }, 200);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [state, rate]);

  return (
    <div className="DiceRoll" data-state={state}>
      <div>
        <span aria-label={state} role="img">
          {state === "dead"
            ? "💀"
            : state === "alive"
            ? "😅"
            : state === "rolling"
            ? "🤮"
            : null}
        </span>{" "}
        <span>
          <b>{isMyself ? "you" : `${age} year old`}</b>
          <br />
          Fatality Rate: {(rate * 100).toFixed(1)}%
        </span>
      </div>
      <div>
        <button disabled={state === "dead"} onClick={rollDice}>
          Roll the dice
        </button>{" "}
        <span>Rolls: {rolls}</span>
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////
function KillCount({ ages }) {
  let [infected, setInfected] = useState(1);
  let [weeks, setWeeks] = useState(1);
  let rate = 0.034;
  let Ro = 2;

  let killed = Math.round(infected * rate);

  function nextWeek() {
    setInfected(infected * Ro);
    setWeeks(weeks + 1);
  }

  return (
    <div id="KillCount">
      <div aria-hidden="true">
        {Array.from({ length: killed }).map((_, index) => (
          // eslint-disable-next-line
          <span key={index}>💀</span>
        ))}
      </div>
      <p>Week: {weeks}</p>
      <p>People You Infected: {infected}</p>
      <p>People You Killed: {killed}</p>
      <button onClick={nextWeek}>Live another week</button>
    </div>
  );
}

function Killers() {
  let location = useLocation();
  let navigate = useNavigate();
  let ages = parseAges(location.search);
  if (ages === null) {
    setTimeout(() => navigate("/"), []);
    return null;
  }

  return (
    <div id="App">
      <div className="prelude">
        <h1>Your Kill Count</h1>
        <p>
          Social distancing is about how many people you want to kill (I hope
          that's zero). Right now, a COVID-19 infected person infects two more.
        </p>
        <p>
          So you infect two people, and next week they infect two people each,
          and then they infect two more, etc. etc.
        </p>
        <p>Go ahead and click the button</p>
      </div>
      <KillCount ages={ages} />
      <p>
        So please, stay home. And while you're there{" "}
        <a href="https://medium.com/@joschabach/flattening-the-curve-is-a-deadly-delusion-eea324fe9727">
          I think this article is worth your time.
        </a>
        . Containment seems to be the best action right now given the numbers.
      </p>
      <hr />
      <h2>More information</h2>
      <p>
        <Link to={`/infected${location.search}`}>
          On the previous page we looked at the fatality rate
        </Link>{" "}
        of COVID-19 and saw that statistically, you and your family will
        probably be fine, but social distancing isn't about you.
      </p>
      <p>
        What really sucks about this virus vs. the flu is that you can carry it
        around with you for weeks infecting people before you even know you have
        it. There is no way to know until it's too late. That's why containment
        is so important.
      </p>
      <p>
        You just saw that logarithmic growth is a powerful thing. The
        coronavirus is following a nearly perfect logarithmic curve in the
        US--even with our low levels of testing. While network marketers hope to
        use it in their favor to gain financial independence, a virus doesn't
        have to be convinced to keep the downline going.
      </p>
      <a
        style={{ display: "block", border: "solid 1px" }}
        href="https://www.worldometers.info/coronavirus/country/us/"
      >
        <img
          style={{ width: "100%" }}
          alt="graph showing a nearly perfect algorithmic growth rate"
          src="/graph.png"
        />
      </a>
      <p>
        The <i>Attack Rate</i> of COVID-19 is estimated by the World Health
        Organization to be{" "}
        <a href="https://www.worldometers.info/coronavirus/#repro">
          between 1.4 and 2.5
        </a>
        . That means if you get it, you're going to infect 2 other people (other
        studies have it as high as 4!). By comparison, the flu is 1.3 and
        anything less than 1 will just die off.
      </p>
    </div>
  );
}

function parseAges(search) {
  let params = new URLSearchParams(search);
  try {
    return params
      .get("ages")
      .split(",")
      .map(str => Number(str));
  } catch (e) {
    return null;
  }
}

function AppRoot() {
  let location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/infected" element={<Infection />} />
      <Route path="/killers" element={<Killers />} />
    </Routes>
  );
}

export default () => (
  <BrowserRouter>
    <AppRoot />
  </BrowserRouter>
);
