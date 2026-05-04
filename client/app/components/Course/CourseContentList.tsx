import React, { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo, MdPlayCircleOutline } from "react-icons/md";
import { HiOutlineLockClosed } from "react-icons/hi";

type Props = {
  data: any;
  activeVideo?: number;
  setActiveVideo?: any;
  isDemo?: boolean;
};

const CourseContentList: FC<Props> = (props) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set<string>()
  );

  // Find unique video sections
  const videoSections: string[] = [
    ...new Set<string>(props.data?.map((item: any) => item.videoSection)),
  ];

  let totalCount: number = 0;

  const toggleSection = (section: string) => {
    const newVisibleSections = new Set(visibleSections);
    if (newVisibleSections.has(section)) {
      newVisibleSections.delete(section);
    } else {
      newVisibleSections.add(section);
    }
    setVisibleSections(newVisibleSections);
  };

  return (
    <div className={`w-full ${!props.isDemo && 'ml-[-30px] min-h-screen sticky top-24 left-0 z-30'}`}>
      {videoSections.map((section: string, sectionIndex: number) => {

        const isSectionVisible = visibleSections.has(section);

        // Filter videos by section
        const sectionVideos: any[] = props.data.filter(
          (item: any) => item.videoSection === section
        );

        const sectionVideoCount: number = sectionVideos.length;
        const sectionStartIndex: number = totalCount;
        totalCount += sectionVideoCount;

        return (
          <div 
            className={`border-b border-purple-500/20 last:border-0 py-3`} 
            key={section}
          >
            <button
              className="w-full flex items-center justify-between group hover:bg-purple-500/5 p-3 -mx-3 rounded-lg transition-all"
              onClick={() => toggleSection(section)}
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <div className={`transition-transform ${isSectionVisible ? 'rotate-0' : '-rotate-90'}`}>
                  <BsChevronDown size={16} className="text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-0.5">
                    {section}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {sectionVideoCount} {sectionVideoCount === 1 ? 'lecture' : 'lectures'}
                  </p>
                </div>
              </div>
            </button>

            {isSectionVisible && (
              <div className="mt-2 ml-6 space-y-1">
                {sectionVideos.map((item: any, index: number) => {
                  const videoIndex: number = sectionStartIndex + index;
                  const isActive = videoIndex === props.activeVideo;
                  
                  const isLocked = item.isLocked === true;
                  const isClickable = !props.isDemo && !isLocked;

                  return (
                    <div
                      className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition-all ${
                        isActive 
                          ? "bg-purple-600/20 border border-purple-500/30" 
                          : isLocked
                            ? "opacity-60"
                            : "hover:bg-purple-500/5"
                      } ${isClickable ? 'cursor-pointer' : isLocked ? 'cursor-not-allowed' : ''}`}
                      key={item._id}
                      onClick={() => isClickable && props?.setActiveVideo(videoIndex)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <MdOutlineOndemandVideo
                          size={18}
                          className={`flex-shrink-0 ${
                            isActive ? "text-purple-400" : "text-gray-500"
                          }`}
                        />
                        <span className={`text-sm truncate ${
                          isActive 
                            ? 'text-white font-medium'
                            : 'text-gray-300'
                        }`}>
                          {item.title}
                        </span>
                        {isLocked && (
                          <HiOutlineLockClosed size={13} className="flex-shrink-0 text-gray-500 ml-1" />
                        )}
                      </div>
                      {isLocked && (
                        <div className="flex-shrink-0 ml-2">
                          <span className="text-[10px] text-gray-500 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 tracking-wide uppercase">
                            Soon
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
