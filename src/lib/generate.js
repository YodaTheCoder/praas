import { getReviews } from "./getReviews";
import { getCategories } from "../lib/getCategories";

const pronouns = {
  male: { primary: "he", secondary: "his", ternary: "him" },
  female: { primary: "she", secondary: "her", ternary: "her" },
  neutral: { primary: "they", secondary: "their", ternary: "them" },
};

const getHasHaveReplacement = (gender, usingName) => {
  const genderHasHave = gender == "neutral" ? "have" : "has";
  return usingName ? "has" : genderHasHave;
};

const getIsAreReplacement = (gender, usingName) => {
  const genderIsAre = gender == "neutral" ? "are" : "is";
  return usingName ? "is" : genderIsAre;
};

const getVerbEndsInSReplacement = (gender, usingName) => {
  const genderEndsInS = gender == "neutral" ? "" : "s";
  return usingName ? "s" : genderEndsInS;
};

const getVerbEndsInESReplacement = (gender, usingName) => {
  const genderEndsInES = gender == "neutral" ? "" : "es";
  return usingName ? "es" : genderEndsInES;
};

const capitaliseSentences = (sentences) => {
  const cappedParts = sentences.split(".").map((part) => {
    const trimmedPart = part.trim();
    return `${trimmedPart.charAt(0).toUpperCase()}${trimmedPart.slice(1)}`;
  });
  return cappedParts.join(". ");
};

const pivotReviews = (reviewArray) => {
  const reviewsByCategory = {};
  reviewArray.forEach((r) => {
    r.categories.forEach((c) => {
      if (!reviewsByCategory[c]) {
        reviewsByCategory[c] = [];
      }
      const { id, response } = r;
      reviewsByCategory[c].push({ id, response });
    });
  });

  return reviewsByCategory;
};

export async function generate(peer, gender, categoryString, responseCount) {
  const response = [];
  const peerPossessive = `${peer}'s`;
  const reviews = await getReviews();
  let requestedCategories = categoryString.split(",");
  const categoryReviews = pivotReviews(reviews);

  if (categoryString === "ALL") {
    requestedCategories = await getCategories();
  }

  // iterate over the requested categories
  for (let rc of requestedCategories) {
    let count = 0;
    let valueResponse = "";

    // get the available responses for the category
    const responses = categoryReviews[rc];
    if (!responses) continue;

    let used = [];
    const maxResponse = Math.min(responseCount, responses.length);

    for (let i = 0; i < maxResponse; i++) {
      // pick a random number that has not been used previously
      let rnd;
      do {
        rnd = Math.floor(Math.random() * responses.length);
      } while (used.includes(rnd));
      used.push(rnd);

      // get the random response
      const chosen = responses[rnd];

      // alternate using Name/Pronoun
      const useName = count % 2 == 0;
      const thisPeer = useName ? peer : pronouns[gender].primary;

      // get replacements based on gender and if we are using name/pronoun
      const contextHasHave = getHasHaveReplacement(gender, useName);
      const contextIsAre = getIsAreReplacement(gender, useName);
      const contextVerbEndsInS = getVerbEndsInSReplacement(gender, useName);
      const contextVerbEndsInES = getVerbEndsInESReplacement(gender, useName);

      // replace placeholders
      const thisResponse = chosen.response
        .replace(/\|peer\|/g, thisPeer)
        .replace(/\|peer's\|/g, peerPossessive)
        .replace(/\|is-are\|/g, contextIsAre)
        .replace(/\|has-have\|/g, contextHasHave)
        .replace(/\|pronoun-primary\|/g, pronouns[gender].primary)
        .replace(/\|pronoun-secondary\|/g, pronouns[gender].secondary)
        .replace(/\|pronoun-ternary\|/g, pronouns[gender].ternary)
        .replace(/\|s\|/g, contextVerbEndsInS)
        .replace(/\|es\|/g, contextVerbEndsInES);

      // append the response and capitalise first letter
      valueResponse += capitaliseSentences(thisResponse);

      // toggle the name/pronoun choice
      count++;
    }

    response.push({
      category: rc,
      text: valueResponse.trim(),
    });
  }

  return response;
}
