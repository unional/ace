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
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var UnHighlightRules = function() {
        // regexp must not have capturing parentheses
        // regexps are ordered -> the first match is used
        this.$rules = {
            "line_comment": [
                {token: "comment", regex: "$|^", next: "start"},
                {defaultToken: "comment"}
            ],
            "start": [
                {
                    token: "comment",
                    regex: "//.*$"
                },
                {
                    token: "operator.endSession",
                    regex: "----.*$"
                },
                {
                    // (context)*(direction)(context)*
                    token: "link.relation",
                    regex: /(((?:\[)((?:[^\]]+))(?:\]\()([^\)]+)([\/\\])([^\)]+)(?:\)))+)((?:->|<-|<->))(((?:\[)((?:[^\]]+))(?:\]\()([^\)]+)([\/\\])([^\)]+)(?:\)))+)/
                },
                {   // [Name](nodeId(?:defaultOrNot)nameIndex)
                    // DefaultOrNot: / = regular, \ = default. (currently not checking)
                    // This works for internal link. Does not work for external yet.
                    token: "link",
                    regex: /(\[)((?:[^\]]+))(\]\()([^\)]+)([\/\\])([^\)]+)\)/
                },
                {
                    token: "link.type",
                    regex: /(:\[)((?:[^\]]+))(\]\()([^\)]+)([\/\\])([^\)]+)\)/
                },
                {
                    token: "operator",
                    regex: "->|<-|<->"
                },
                {
                    token: "operator",
                    regex: "\\[",
                    next: "nodeName"
                },
                {
                    //NOTE: this is temporary. Should use the current tab setting to determine.
                    token: "content",
                    regex: /(\t|\s{4}).+/
                },
                {
                    defaultToken: "nodeName"
                }
            ],
            "nodeName": [
                {
                    token: "operator",
                    regex: /\]/,
                    next: "start"
                },
                {
                    defaultToken: "nodeName"
                }
            ]
        };

    };

    oop.inherits(UnHighlightRules, TextHighlightRules);

    exports.UnHighlightRules = UnHighlightRules;
});
