import React from "react";

export default function About() {
  return (
    <div className="page">
      <h1>About</h1>
      <p>
        I currently live in California and work at Stripe. I grew up in Ireland and previously
        studied at MIT.
      </p>
      <p>Email: patrick@collison.ie.</p>

      <h2>Things I'm involved with and areas of interest:</h2>
      <ul>
        <li>
          <strong>Economic growth.</strong> Stripe's core mission.
        </li>
        <li>
          <strong>Entrepreneurship.</strong> Stripe Atlas helps many new companies get started.
        </li>
        <li>
          <strong>Climate.</strong> Stripe Climate is the largest coalition of carbon removal purchasers
          in the world.
        </li>
        <li>
          <strong>Housing production.</strong> CA YIMBY is pushing for important reform; so too is Ronan
          Lyons. (See also the housing theory of everything.)
        </li>
        <li>
          <strong>Books and ideas.</strong> Stripe Press and Works in Progress both publish on the theme
          of economic and technological advancement. Tyler Cowen and I helped start Progress Studies.
        </li>
        <li>
          <strong>Science.</strong> Arc Institute is a new way to do biomedical research. Fast Grants
          distributed substantial amounts to scientists during the COVID pandemic.
        </li>
      </ul>

      <h2>Elsewhere</h2>
      <p>pc on GitHub; patrickc on Twitter.</p>
    </div>
  );
}
