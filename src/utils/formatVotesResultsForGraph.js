export const formatVotesResultsForGraph = (results, speakers, colors = []) => {
    const keys = Object.keys(results)
    const resultsWithAllSpeakers = results
    Object.keys(speakers).forEach((speakerId) => {
        if (!keys.includes(speakerId)) {
            resultsWithAllSpeakers[speakerId] = 0
            keys.push(speakerId)
        }
    })

    return [
        [
            'Player',
            'Votes',
            { role: 'style' },
            {
                sourceColumn: 0,
                role: 'annotation',
                type: 'string',
                calc: 'stringify',
            },
        ],
        ...keys
            .filter((speakerId) => !!speakers[speakerId]) //only list referenced speakers
            .sort((a, b) => {
                return resultsWithAllSpeakers[b] - resultsWithAllSpeakers[a]
            })
            .map((speakerId, index) => {
                return [
                    speakers[speakerId] ? speakers[speakerId].name : speakerId,
                    resultsWithAllSpeakers[speakerId],
                    colors[index],
                    null,
                ]
            }),
    ]
}
