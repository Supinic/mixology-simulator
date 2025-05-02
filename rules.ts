import type { StrategyRule } from "./definitions.js";
export type RulesetDefinition = {
    name: string;
    ruleset: StrategyRule[];
};

const doAllWhenMixalot: StrategyRule = (context, request) => {
    if (request.some(i => i.potion === "MAL")) {
        return request;
    }

    return false;
};

export const control = {
    name: "control",
    ruleset: [
        (context, request) => request
    ]
} satisfies RulesetDefinition;

export const resinFocus = {
    name: "resinFocus",
    ruleset: [
        doAllWhenMixalot,
        (context, request) => {
            const allTriples = request.every(i => i.potion === "MMM" || i.potion === "AAA" || i.potion === "LLL");
            return (allTriples)
                ? [request[0]]
                : request;
        }
    ]
} satisfies RulesetDefinition;

export const moxLyeFocus = {
    name: "moxLyeFocus",
    ruleset: [
        doAllWhenMixalot,
        (context, request) => {
            const lyeItems = request.filter(i => i.potion.includes("M") || i.potion.includes("L"));
            return (lyeItems.length === 0) ? false : lyeItems;
        },
        (context, request) => [request[0]]
    ]
} satisfies RulesetDefinition;

export const simpleLyeFocus = {
    name: "simpleLyeFocus",
    ruleset: [
        doAllWhenMixalot,
        (context, request) => {
            const lyeItems = request.filter(i => i.potion.includes("L"));
            return (lyeItems.length === 0) ? false : lyeItems;
        },
        (context, request) => [request[0]]
    ]
} satisfies RulesetDefinition;

export const involvedLyeFocus = {
    name: "involvedLyeFocus",
    ruleset: [
        doAllWhenMixalot,
        (context, request) => {
            const lyeItems = request.filter(i => i.potion.includes("L"));
            if (lyeItems.length >= 2) {
                return request;
            }

            return (lyeItems.length === 0) ? false : lyeItems;
        },
        (context, request) => [request[0]]
    ]
} satisfies RulesetDefinition;

export const experienceFocus = {
    name: "experienceFocus",
    ruleset: [
        doAllWhenMixalot,
        (context, request) => {
            const list = [];
            for (const item of request) {
                if (item.potion === "MML" || item.potion === "MLL" || item.potion === "ALA" || item.potion === "ALL") {
                    list.push(item);
                }
            }

            return (list.length === 0)
                ? false
                : list;
        },
        (context, request) => {
            const list = [];
            for (const item of request) {
                if (item.potion === "MMA" || item.potion === "AAM") {
                    list.push(item);
                }
            }

            return (list.length === 0)
                ? false
                : list;
        },
        (context, request) => {
            const tripleLye = request.find(i => i.potion === "LLL");
            return (tripleLye) ? [tripleLye] : false;
        },
        (context, request) => [request[0]]
    ]
} satisfies RulesetDefinition;

export default [
    control,
    resinFocus,
    moxLyeFocus,
    experienceFocus,
    simpleLyeFocus,
    involvedLyeFocus,
] satisfies RulesetDefinition[];
