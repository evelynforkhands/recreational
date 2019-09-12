step := 0
SetCapsLockState, on
Loop
{
	try	
	{
		Input, SingleKey, L1 V
		if (%SingleKey% in "a")
			if step = 0
				SetCapsLockState, on
			else
				SetCapsLockState, off
			step := Mod(step + 1, 2)
	}
}