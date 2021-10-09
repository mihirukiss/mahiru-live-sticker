// ==UserScript==
// @name         孟宝直播间表情选择器
// @namespace    https://mihiru.com/
// @version      1.2
// @description  提供在B站Mahiru直播间直接点选输入表情的功能
// @author       MM
// @match        *://live.bilibili.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const init = function() {
        const livers = [
            "21672024", //Mahiru
            "23260932" //Koxia
        ]
        const keywords = [
            ['[call]','[tea]','015','差不多得了','哭晕在厕所','[err]','[钓鱼]','[咬钩]','绿帽','不也挺好吗','草','叹气','诶嘿','喜极而泣'],
            ["?","给你一拳","怪死了","哈哈","好夜",'救命',"哭哭","要我一直哭吗","[震惊]","不愿面对","[可恶]","[来两拳]","[吃kuya]","[流口水]","趴","[思考]","[萌新坐姿]","[呜呜]","[赞]"]
        ]
        const roomUrl = window.location.href;
        const roomNo = roomUrl.match(/\d+/)
        if (!roomNo || roomNo.length < 1) {
            return
        }
        const liver = livers.indexOf(roomNo[0])
        if (liver < 0) {
            return
        }
        let iconLeftPart = document.querySelector('.icon-left-part')
        if (!iconLeftPart) {
            new MutationObserver((mutations,observer) => {
                iconLeftPart = document.querySelector('.icon-left-part')
                if(iconLeftPart){
                    observer.disconnect()
                    init()
                    return
                }
            }).observe(document.querySelector('#aside-area-vm')||document.body, {
                childList: true,
                subtree: true
            })
            return
        }
        const chatInput = document.querySelector('textarea.chat-input')
        let dataAttributeName;
        for(let name of iconLeftPart.getAttributeNames()) {
            if (name.startsWith('data-v-')) {
                dataAttributeName = name
                break
            }
        }
        let mouseOnIcon = false
        let mouseOnDialog = false
        let hideDialogTimeoutId = false
        const controlPanel = document.querySelector('#control-panel-ctnr-box')
        const dialog = document.createElement('div')
        const openDialog = function() {
            dialog.className = 'border-box dialog-ctnr common-popup-wrap top-left a-scale-in-ease v-leave-to'
            dialog.style.display = ''
        }
        const checkHideDialog = function() {
            if (!mouseOnIcon && !mouseOnDialog) {
                dialog.className = 'border-box dialog-ctnr common-popup-wrap top-left a-scale-out v-leave-to'
                dialog.style.display = 'none'
            }
            hideDialogTimeoutId = false
        }
        dialog.setAttribute(dataAttributeName, '')
        dialog.style.bottom = '100%'
        dialog.style.padding = '16px'
        dialog.style.position = 'absolute'
        dialog.style.zIndex = '699'
        dialog.style.transformOrigin = '42px bottom'
        dialog.style.width = '280px'
        dialog.style.margin = '0px 0px 0px -140px'
        dialog.style.left = '50%'
        dialog.style.display = 'none'
        const emojiClick = function(e) {
            chatInput.value = chatInput.value + e.currentTarget.dataset.keyword
            chatInput.dispatchEvent(new Event('input', {"bubbles":true, "cancelable":true}))
        }
        for (let i=0;i<keywords[liver].length;i++) {
            const emojiImg = document.createElement('img')
            emojiImg.src = 'https://cdn.mihiru.com/img/' + (liver * 1000 + 2000 + i) + (keywords[liver][i].startsWith('[')?'.gif' : '.png')
            emojiImg.setAttribute('data-keyword', keywords[liver][i].startsWith('[') ? keywords[liver][i] : ('[' + keywords[liver][i] + ']'))
            emojiImg.onclick = emojiClick
            emojiImg.style.margin = '2px'
            dialog.append(emojiImg)
        }
        dialog.addEventListener('mouseenter', e=>{
            mouseOnDialog = true
            if (hideDialogTimeoutId) {
                window.clearTimeout(hideDialogTimeoutId)
                hideDialogTimeoutId = false
            }
        })
        dialog.addEventListener('mouseleave', e=>{
            mouseOnDialog = false
            if (!hideDialogTimeoutId) {
                hideDialogTimeoutId = window.setTimeout(checkHideDialog, 500);
            }
        })
        controlPanel.append(dialog)
        const icon = document.createElement('span')
        icon.className = 'icon-item icon-font icon-pic-biaoqing2-dynamic live-skin-main-text'
        icon.setAttribute(dataAttributeName, '')
        icon.setAttribute('title', '表情')
        icon.addEventListener('mouseenter', e=>{
            mouseOnIcon = true
            if (hideDialogTimeoutId) {
                window.clearTimeout(hideDialogTimeoutId)
                hideDialogTimeoutId = false
            }
            openDialog()
        })
        icon.addEventListener('mouseleave', e=>{
            mouseOnIcon = false
            if (!hideDialogTimeoutId) {
                hideDialogTimeoutId = window.setTimeout(checkHideDialog, 500);
            }
        })
        iconLeftPart.append(icon)
    }

    init()
})();