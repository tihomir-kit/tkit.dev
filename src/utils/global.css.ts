import { css } from "@emotion/core";

import { colors } from "./colors";

// NOTE: This file is intended for 3rd party library overrides

export const globalStyle = css`
  .gatsby-highlight {
    font-size: 13px;
    margin-bottom: 1.75rem;

    pre {
      background: ${colors.harmonizedCodeBackground};
    }

    .line-numbers-rows {
      color: $light;
    }
  }

  .language-text {
    background: ${colors.harmonizedCodeBackground};
  }

  .line-numbers {
    .line-numbers-rows {
      border: none;
      padding: 13px 14px;
    }
  }
`;
