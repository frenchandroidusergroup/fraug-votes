export const formatVotesResultsForGraph = (results, speakers) => {
    const keys = Object.keys(results)
    const resultsWithAllSpeakers = results
    Object.keys(speakers).forEach((speakerId) => {
        if (!keys.includes(speakerId)) {
            resultsWithAllSpeakers[speakerId] = 0
            keys.push(speakerId)
        }
    })

    return [
        ...keys
            .filter((speakerId) => !!speakers[speakerId]) //only list referenced speakers
            .sort((a, b) => {
                return resultsWithAllSpeakers[a] - resultsWithAllSpeakers[b]
            })
            .map((speakerId, index) => {
                return {
                    name: speakerId,
                    Votes: resultsWithAllSpeakers[speakerId]
                        ? resultsWithAllSpeakers[speakerId]
                        : 0,
                }
            }),
    ]
}
export const generateAxisValues = (results) => {
    if (!results || !results.length) return [0]
    const maxValues = results[results.length - 1].Votes

    const list = []
    for (let i = 0; i <= maxValues; i++) {
        list.push(i)
    }

    return list
}
