Loop
{
	Input, SingleKey, L1 V
	if GetKeyState("CapsLock", "T") = 1
 	{
		SetCapsLockState, off
 	}
	else if GetKeyState("CapsLock", "F") = 0
 	{
   		SetCapsLockState, on
	}
}
