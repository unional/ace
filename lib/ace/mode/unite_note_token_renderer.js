/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var lang = require("../lib/lang");

    var UniteNoteTokenRenderer = function() {
        this.config = {};
        this.config.characterWidth = 8;
    };

    (function() {
        this.render = function(stringBuilder, screenColumn, token, value) {
            var self = this;
            var replaceReg = /\t|&|<|( +)|([\x00-\x1f\x80-\xa0\u1680\u180E\u2000-\u200f\u2028\u2029\u202F\u205F\u3000\uFEFF])|[\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3000-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]/g;
            var replaceFunc = function(c, a, b, tabIdx, idx4) {
                if (a) {
                    return self.showInvisibles ?
                        "<span class='ace_invisible ace_invisible_space'>" + lang.stringRepeat(self.SPACE_CHAR, c.length) + "</span>" :
                        lang.stringRepeat("\xa0", c.length);
                } else if (c == "&") {
                    return "&#38;";
                } else if (c == "<") {
                    return "&#60;";
                } else if (c == "\t") {
                    var tabSize = self.session.getScreenTabSize(screenColumn + tabIdx);
                    screenColumn += tabSize - 1;
                    return self.$tabStrings[tabSize];
                } else if (c == "\u3000") {
                    // U+3000 is both invisible AND full-width, so must be handled uniquely
                    var classToUse = self.showInvisibles ? "ace_cjk ace_invisible ace_invisible_space" : "ace_cjk";
                    var space = self.showInvisibles ? self.SPACE_CHAR : "";
                    screenColumn += 1;
                    return "<span class='" + classToUse + "' style='width:" +
                        (self.config.characterWidth * 2) +
                        "px'>" + space + "</span>";
                } else if (b) {
                    return "<span class='ace_invisible ace_invisible_space ace_invalid'>" + self.SPACE_CHAR + "</span>";
                } else {
                    screenColumn += 1;
                    return "<span class='ace_cjk' style='width:" +
                        (self.config.characterWidth * 2) +
                        "px'>" + c + "</span>";
                }
            };

            var output = value.replace(replaceReg, replaceFunc);

            if (!this.$textToken[token.type]) {
                var classes = "ace_" + token.type.replace(/\./g, " ace_");
                var style = "";
                if (token.type == "fold")
                    style = " style='width:" + (token.value.length * this.config.characterWidth) + "px;' ";
                stringBuilder.push("<span class='", classes, "'", style, ">", output, "</span>");
            }
            else {
                stringBuilder.push(output);
            }
            return screenColumn + value.length;
        }
    }).call(UniteNoteTokenRenderer.prototype);

    exports.TokenRenderer = UniteNoteTokenRenderer;
});
