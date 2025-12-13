import React from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const handleEmojiSelect = (emoji) => {
    onEmojiSelect(emoji.native);
  };

  return (
    <div className="absolute bottom-24 right-24 z-50">
      <div className="relative">
        <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"></div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            previewPosition="none"
            skinTonePosition="none"
            perLine={8}
            emojiSize={22}
            maxFrequentRows={1}
            categories={[
              "frequent",
              "people",
              "nature",
              "foods",
              "activity",
              "places",
              "objects",
              "symbols",
              "flags",
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;
