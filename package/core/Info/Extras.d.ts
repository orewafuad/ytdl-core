import { YTDL_Media, YTDL_Author, YTDL_WatchPageInfo, YTDL_RelatedVideo, YTDL_Storyboard, YTDL_Chapter, YTDL_VideoDetails, YTDL_MoreVideoDetails, YT_YTInitialPlayerResponse } from '../../types/youtube';
export default class InfoExtras {
    static getMedia(info: YTDL_WatchPageInfo): YTDL_Media | null;
    static getAuthor(info: YTDL_WatchPageInfo): YTDL_Author | null;
    static getLikes(info: YTDL_WatchPageInfo): number | null;
    static getRelatedVideos(info: YTDL_WatchPageInfo): Array<YTDL_RelatedVideo>;
    static cleanVideoDetails(videoDetails: YTDL_VideoDetails, microformat: YT_YTInitialPlayerResponse['microformat'] | null): YTDL_MoreVideoDetails;
    static getStoryboards(info: YT_YTInitialPlayerResponse | null): Array<YTDL_Storyboard>;
    static getChapters(info: YTDL_WatchPageInfo): Array<YTDL_Chapter>;
}
