const { sumCompatibleWeights } = require("./compatibilities");

describe("sumCompatibleWeights()", () => {
  it("set weight to 1 for simplest case", () => {
    // given
    const anyKeys = ["any", "keys"];

    // when
    const got = sumCompatibleWeights(
      [{ key: "A" }, { key: "B" }, { key: "C" }, { key: "D" }],
      anyKeys
    );

    // then
    expect(got).toEqual([
      { key: "A", weight: 1 },
      { key: "B", weight: 1 },
      { key: "C", weight: 1 },
      { key: "D", weight: 1 },
    ]);
  });

  it("reduces compatibilities to weight", () => {
    // given
    const keyCompatibilities = [
      { key: "A", compatibilities: [{ alfa: 5 }] },
      { key: "B", compatibilities: [{ beta: 1 }, { gamma: 3 }, { delta: 2 }] },
      { key: "C", constraints: ["alfa"] },
      { key: "D", constraints: ["gamma"], compatibilities: [{ beta: 100 }] },
    ];

    const scenarios = [
      {
        keys: ["alfa"],
        expected: [
          { key: "A", weight: 5 },
          { key: "B", weight: 0 },
          { key: "C", weight: 1 },
        ],
      },
      {
        keys: ["alfa", "delta"],
        expected: [
          { key: "A", weight: 5 },
          { key: "B", weight: 2 },
          { key: "C", weight: 1 },
        ],
      },
      {
        keys: ["beta", "gamma"],
        expected: [
          { key: "A", weight: 0 },
          { key: "B", weight: 4 },
          { key: "D", weight: 100 },
        ],
      },
      {
        keys: ["alfa", "beta", "gamma"],
        expected: [
          { key: "A", weight: 5 },
          { key: "B", weight: 4 },
          { key: "C", weight: 1 },
          { key: "D", weight: 100 },
        ],
      },
      {
        keys: ["beta"],
        expected: [
          { key: "A", weight: 0 },
          { key: "B", weight: 1 },
        ],
      },
    ];

    // then
    scenarios.forEach(({ keys, expected }) => {
      const got = sumCompatibleWeights(keyCompatibilities, keys);
      expect(got).toEqual(expected);
    });
  });
});
