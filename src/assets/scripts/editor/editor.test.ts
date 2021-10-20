import * as editor from "@/assets/scripts/editor/editor"

// @ponicode
describe("on", () => {
    let inst: any

    beforeEach(() => {
        inst = new editor.default("03ea49f8-1d96-4cd0-b279-0684e3eec3a9", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.on(true, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.on("payment", 10)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.on(true, true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.on("invoice", 5)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.on(-5.48, 256)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst.on(Infinity, false)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("focus", () => {
    let inst: any

    beforeEach(() => {
        inst = new editor.default("a85a8e6b-348b-4011-a1ec-1e78e9620782", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.focus()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("insert", () => {
    let inst: any

    beforeEach(() => {
        inst = new editor.default("a85a8e6b-348b-4011-a1ec-1e78e9620782", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.insert("", undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("insertPrefix", () => {
    let inst: any

    beforeEach(() => {
        inst = new editor.default("7289708e-b17a-477c-8a77-9ab575c4b4d8", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.insertPrefix("Hello, world!")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.insertPrefix("This is a Text")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.insertPrefix("Foo bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.insertPrefix("foo bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.insertPrefix("")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("getText", () => {
    let inst: any

    beforeEach(() => {
        inst = new editor.default("a85a8e6b-348b-4011-a1ec-1e78e9620782", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.getText()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("setText", () => {
    let inst: any

    beforeEach(() => {
        inst = new editor.default("03ea49f8-1d96-4cd0-b279-0684e3eec3a9", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.setText("Dillenberg")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.setText("elio@example.com")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.setText("Elio")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.setText("")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("getSelection", () => {
    let inst: any

    beforeEach(() => {
        inst = new editor.default("7289708e-b17a-477c-8a77-9ab575c4b4d8", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.getSelection()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("getLineText", () => {
    let inst: any

    beforeEach(() => {
        inst = new editor.default("7289708e-b17a-477c-8a77-9ab575c4b4d8", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.getLineText(-5.48)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.getLineText(-100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.getLineText(100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.getLineText(1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.getLineText(0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst.getLineText(Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("getSelectionPosition", () => {
    let inst: any

    beforeEach(() => {
        inst = new editor.default("a85a8e6b-348b-4011-a1ec-1e78e9620782", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.getSelectionPosition()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("moveCursorPosition", () => {
    let inst: any

    beforeEach(() => {
        inst = new editor.default("03ea49f8-1d96-4cd0-b279-0684e3eec3a9", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.moveCursorPosition(380, 320)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.moveCursorPosition(100, 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.moveCursorPosition(0, 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.moveCursorPosition(70, 70)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.moveCursorPosition(90, 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst.moveCursorPosition(NaN, NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("isFocus", () => {
    let inst: any

    beforeEach(() => {
        inst = new editor.default("a85a8e6b-348b-4011-a1ec-1e78e9620782", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.isFocus()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("gotoLine", () => {
    let inst: any

    beforeEach(() => {
        inst = new editor.default("7289708e-b17a-477c-8a77-9ab575c4b4d8", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.gotoLine(100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.gotoLine(-5.48)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.gotoLine(1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.gotoLine(0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.gotoLine(-100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst.gotoLine(-Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("selectLine", () => {
    let inst: any

    beforeEach(() => {
        inst = new editor.default("a85a8e6b-348b-4011-a1ec-1e78e9620782", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.selectLine(0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.selectLine(1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.selectLine(-5.48)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.selectLine(100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.selectLine(-100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst.selectLine(NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})
