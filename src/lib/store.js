import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export const useAttachmentsStore = create(
  devtools(
    persist(
      (set) => ({
        attachments: {},

        addAttachment: (projectId, issue) => {
            // console.log("adding attachment")
          set(
            (state) => ({
              attachments: {
                ...state.attachments,
                [projectId]: [...(state.attachments[projectId] || []), issue],
              },
              
            }),
            false,

            "attachments/addAttachment"
          );
          
        },

        removeAttachment: (projectId, issueId) => {
            // console.log("removing attachment")
          set(
            (state) => ({
              attachments: {
                ...state.attachments,
                [projectId]: state.attachments[projectId]?.filter(
                  (issue) => issue.id !== issueId
                ) || [],
              },
            }),
            false,
            "attachments/removeAttachment"
          );
        },
      }),
      {
        name: "attachments-storage", 
        getStorage: () => localStorage,
      }
    ),
    { name: "Zustand Attachments Store" } 
  )
);
