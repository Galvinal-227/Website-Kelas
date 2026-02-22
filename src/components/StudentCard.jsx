import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ExternalLink, Code, Award, Sparkles, User } from 'lucide-react';

const StudentCard = ({ student, index, onViewProfile, lastUpdate }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 50, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: index * 0.05,
        ease: "back.out(1.2)"
      }
    );
  }, [index, lastUpdate]);

  useEffect(() => {
    setAvatarError(false);
  }, [student, lastUpdate]);

  const handleHover = () => {
    setIsHovered(!isHovered);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: isHovered ? 0 : -10,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const getAvatarFallback = () => {
    return (
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center border-4 border-orange-500/50">
        <User className="w-10 h-10 text-orange-400" />
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      className="group relative bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border-2 border-gray-800 overflow-hidden cursor-pointer hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      onClick={() => onViewProfile(student)} 
    >
      {/* Orange Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      {/* Student Number Badge */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-orange-500 text-black text-sm rounded-full font-semibold shadow-lg">
        #{student.id.toString().padStart(2, '0')}
      </div>
      

      {/* Content */}
      <div className="relative z-10 pt-8">
        {/* Avatar */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            {student.avatar && !avatarError ? (
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-500/50 shadow-lg">
                <img 
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                  loading="lazy"
                />
              </div>
            ) : (
              getAvatarFallback()
            )}
            <div className="absolute -bottom-2 -right-2 bg-black border-2 border-orange-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-xs font-bold text-black">PPLG</span>
              </div>
            </div>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-white text-center mb-4 truncate">
          {student.name}
        </h3>

        {/* Nickname */}
        <div className="text-center mb-2">
          <span className="px-3 py-1 bg-gray-800 text-orange-400 text-sm rounded-full border border-gray-700">
            {student.nickname}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent my-4" />

        {/* Interests */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">Minat Bidang</span>
          </div>
          <div className="space-y-2">
            {student.interests && student.interests.slice(0, 2).map((interest, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 bg-gray-900 text-gray-300 text-sm rounded-full border border-gray-700 font-medium hover:border-orange-500 hover:bg-gray-800 hover:text-orange-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  <span className="truncate">{interest}</span>
                </div>
              </div>
            ))}
            {student.interests && student.interests.length > 2 && (
              <div className="px-3 py-1.5 bg-gray-900 text-gray-400 text-sm rounded-full border border-gray-700 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  <span>+{student.interests.length - 2} lainnya</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4 text-gray-300" />
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {student.skills && student.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-900 text-gray-300 text-xs rounded border border-gray-700 hover:border-orange-500 hover:text-orange-300 transition-colors truncate"
              >
                {skill}
              </span>
            ))}
            {student.skills && student.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-900 text-gray-400 text-xs rounded border border-gray-700">
                +{student.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-gray-300 rounded-lg border-2 border-gray-700 hover:border-orange-500 hover:text-orange-300 hover:from-orange-500/20 hover:to-orange-600/20 transition-all duration-300 group/btn"
          onClick={(e) => {
            e.stopPropagation(); 
            onViewProfile(student);
          }}
        >
          <span className="font-bold">VIEW PROFILE</span>
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Orange Hover Effect Indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 transform transition-transform duration-300 ${
        isHovered ? 'translate-y-0' : 'translate-y-full'
      }`} />
    </div>
  );
};

export default StudentCard;