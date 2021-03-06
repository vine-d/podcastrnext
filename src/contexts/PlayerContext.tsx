import { createContext, ReactNode, useContext, useState } from 'react'

type Episode = {
	title: string;
	members: string;
	thumbnail: string;
	duration: number;
	url: string;
}

type PlayerContextData = {
	episodeList: Episode[]
	currentEpisodeIndex: number
	isPlaying: boolean
	isLooping: boolean
	isSuffle: boolean
	play: (episode:Episode) => void
	playList: (list:Episode[], index:number) => void
	playNext: () => void
	playPrevious: () => void
	togglePlay: () => void
	toggleLooping: () => void
	toggleSuffle: () => void
	clearPlayerState: () => void
	setPlayingState: (state: boolean) => void
	hasNext: boolean
	hasPrevious: boolean
}

type PlayerContextProviderProps = {
	children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerContextProviderProps){
	const [episodeList, setEpisodeList] = useState([])
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isLooping, setIsLooping] = useState(false)
	const [isSuffle, setIsSuffle] = useState(false)

	const hasNext = isSuffle || (currentEpisodeIndex + 1) < episodeList.length
	const hasPrevious = currentEpisodeIndex > 0

	function play(episode: Episode) {
		setEpisodeList([episode])
		setCurrentEpisodeIndex(0)
		setIsPlaying(true)
	}

	function playList(list: Episode[], index: number) {
		setEpisodeList(list)
		setCurrentEpisodeIndex(index)
		setIsPlaying(true)
	}

	function togglePlay() {
		setIsPlaying(!isPlaying)
	}

	function toggleLooping() {
		setIsLooping(!isLooping)
	}

	function toggleSuffle() {
		setIsSuffle(!isSuffle)
	}

	function setPlayingState(state: boolean) {
		setIsPlaying(state)
	}

	function clearPlayerState() {
		setEpisodeList([])
		setCurrentEpisodeIndex(0)
	}

	function playNext() {
		if (isSuffle) {
			const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
			setCurrentEpisodeIndex(nextRandomEpisodeIndex)
		} else if (hasNext) {
			setCurrentEpisodeIndex(currentEpisodeIndex + 1)
		}
	}

	function playPrevious() {
		if (hasPrevious)
		setCurrentEpisodeIndex(currentEpisodeIndex - 1)
	}

  return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisodeIndex,
				isPlaying,
				isLooping,
				isSuffle,
				play,
				playList,
				playNext,
				playPrevious,
				togglePlay,
				toggleLooping,
				toggleSuffle,
				setPlayingState,
				clearPlayerState,
				hasNext,
				hasPrevious
			}}
		>
			{children}
		</PlayerContext.Provider>
	)
}

export const usePlayer = () => {
	return useContext(PlayerContext)
}
