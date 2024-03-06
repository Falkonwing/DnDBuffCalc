import React, { useState } from "react";
import { BiSolidPlusCircle,BiSolidMinusCircle } from "react-icons/bi";

class WeaponDamageDice {
    numberOfDices = 0;
    diceType = 0;

    splitString(inputString) {
        const regex = /\D/;
        const splitArray = inputString.split(regex);
        const firstNumber = parseInt(splitArray[0]);
        const secondNumber = parseInt(splitArray[1]);
        return [firstNumber, secondNumber];
    }
    constructor(basedamage) {
        [this.numberOfDices,this.diceType] = this.splitString(basedamage);

    }

    toString = (sizeIncrease = 0) => {
        let tempNumberOfDices = this.numberOfDices;
        let tempDiceType = this.diceType;
        // logic for size Increase
        for(let i = 0; i < sizeIncrease;i++){
            for(let j = 0; j < sizeTable.length; j++ ){
                const size = sizeTable[j];
                if( size.medium.toString() === tempNumberOfDices+'d'+tempDiceType ){
                    tempNumberOfDices =  size.large.numberOfDices;
                    tempDiceType = size.large.diceType;
                    break;
                }
            };
        }
        return tempNumberOfDices.toString()+'d'+tempDiceType.toString();
    }
}

const sizeTable = [
    {medium: new WeaponDamageDice('1d2') , large: new WeaponDamageDice('1d3')},
    {medium: new WeaponDamageDice('1d3') , large: new WeaponDamageDice('1d4')},
    {medium: new WeaponDamageDice('1d4') , large: new WeaponDamageDice('1d6')},
    {medium: new WeaponDamageDice('1d6') , large: new WeaponDamageDice('1d8')},
    {medium: new WeaponDamageDice('1d8') , large: new WeaponDamageDice('2d6')},
    {medium: new WeaponDamageDice('1d10') , large: new WeaponDamageDice('2d8')},
    {medium: new WeaponDamageDice('1d12') , large: new WeaponDamageDice('3d6')},
    {medium: new WeaponDamageDice('2d4') , large: new WeaponDamageDice('2d6')},
    {medium: new WeaponDamageDice('2d6') , large: new WeaponDamageDice('3d6')},
    {medium: new WeaponDamageDice('2d8') , large: new WeaponDamageDice('3d8')},
    {medium: new WeaponDamageDice('2d10') , large: new WeaponDamageDice('4d8')},
]

// List of Buffs:
const BuffList = [
    {name: 'PowerAttack' , Attack: -2, Damage: 6 },
    {name: 'Contaigous Zeal' , Attack: +2, Damage: 2 },
    {name: 'Metamorphosis (Huge)' , Attack: -2, Strength: 4, extraAttackOff: true, Size: 2 },
    // {name: 'Metamorphosis (Large)' , Attack: -2, Damage: 6, Size: 1 },
    {name: 'Haste' , Attack: +1, extraAttackHigh: true },
    {name: 'Epidermal Fissure' , Strength: 4 },
    {name: 'Weapon Focus' , Attack: +1, Damage: 0 },
    {name: 'Weapon Enchantment +1' , Attack: +1, Damage: +1 },
]


function Calculator() {
    const [baseAttack,setBaseAttack] = useState(7);
    const [strength,setStrength] = useState(20);
    const [baseWeapondamage, setBaseWeaponDamage] = useState(new WeaponDamageDice('2d4'));
    const [checkboxState, setCheckboxState] = useState({});

    const handleCheckboxChange = (buffName) => {
      setCheckboxState(prevState => ({
        ...prevState,
        [buffName]: !prevState[buffName]
      }));
    };


    const showAttack = (calculatedAttack) => {
        let Attackpattern = '';
        switch(Math.floor((baseAttack-1)/5)){
            case 0: Attackpattern= `+${calculatedAttack}`; break;
            case 1: Attackpattern= `+${calculatedAttack}/+${calculatedAttack-5}`; break;
            case 2: Attackpattern= `+${calculatedAttack}/+${calculatedAttack-5}/+${calculatedAttack-10}`; break;
            case 3: Attackpattern= `+${calculatedAttack}/+${calculatedAttack-5}/+${calculatedAttack-10}/+${calculatedAttack-15}`; break;
            default: Attackpattern= `+${calculatedAttack}`; break;
        }
        BuffList.map((Buff) => {
            if(Buff.extraAttackHigh && checkboxState[Buff.name]) Attackpattern= `+${calculatedAttack}/${Attackpattern}`;
        })
        BuffList.map((Buff) => {
            if(Buff.extraAttackOff && checkboxState[Buff.name]) Attackpattern= `${Attackpattern}/+${calculatedAttack-5}`;
        })
        return Attackpattern;
    }

    const calculateAttack = () => {
        let AttackBonusFromBuffs = 0;
        BuffList.map((Buff) => {
            if(Buff.Attack && checkboxState[Buff.name]) AttackBonusFromBuffs += Buff.Attack;
        })
        return parseInt(baseAttack) + parseInt(calcStrMod()) + parseInt(AttackBonusFromBuffs);
    }

    const WeaponSizeAdaptation = () => {
        let weaponSizeBonusFromBuffs = 0;
        BuffList.map((Buff) => {
            if(Buff.Size && checkboxState[Buff.name]) weaponSizeBonusFromBuffs += Buff.Size;
        })
        return weaponSizeBonusFromBuffs;
    } 
    
    const showDamage = () => {
        return baseWeapondamage.toString(WeaponSizeAdaptation()) + ' + ' + calculateDamageBonus().toString();
    }

    const calcStrMod = () => {
       return ((calculateStrength()-10)/2)
    }

    const calculateDamageBonus = () => {
        let DamageBonusFromBuffs = 0;
        BuffList.map((Buff) => {
            if(Buff.Damage && checkboxState[Buff.name]) DamageBonusFromBuffs += Buff.Damage;
        })
        return Math.floor(calcStrMod() * 1.5) + DamageBonusFromBuffs;
    }

    const calculateStrength = () => {
        let StrengthBonusFromBuffs = 0;
        BuffList.map((Buff) => {
            if(Buff.Strength && checkboxState[Buff.name]) StrengthBonusFromBuffs += Buff.Strength;
        })
        return parseInt(strength) + parseInt(StrengthBonusFromBuffs);
    }  

    return (
        <div className="App m-4">
            <div className="flex flex-col border border-black my-4 py-4 text-xl justify-center" >
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row flex-wrap items-center" >
                        <label className="mr-2">BaseAttack:</label>
                        <div>{baseAttack} </div>
                    </div>
                    <div className="flex flex-row mx-4" >
                        <BiSolidPlusCircle  onClick={() => {setBaseAttack(baseAttack + 1)}} className="text-5xl text-green-500" />
                        <BiSolidMinusCircle onClick={() => {setBaseAttack(baseAttack - 1)}} className="text-5xl text-red-500" />
                    </div>
                </div>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row flex-wrap items-center" >
                        <label className="mr-2">Default Strength:</label>
                        <div>{strength} </div>
                    </div>
                    <div className="flex flex-row mx-4" >
                        <BiSolidPlusCircle  onClick={() => {setStrength(strength + 1)}} className="text-5xl text-green-500" />
                        <BiSolidMinusCircle onClick={() => {setStrength(strength - 1)}}  className="text-5xl text-red-500" />
                    </div>
                </div>
            </div>
            <div className="border border-black my-4 py-4 text-xl">
                {BuffList.map((buff) => (
                    <div key={buff.name}>
                    <label>
                        <input
                            className="m-2 h-5 w-5 rounded-full"
                            type="checkbox"
                            checked={checkboxState[buff.name] || false}
                            onChange={() => handleCheckboxChange(buff.name)}
                        />
                        {buff.name}
                    </label>
                    </div>
                ))}
            </div>
            <div className="border border-black my-4 py-4 text-xl" >
                    <div><label>Calculated Attack: </label>{showAttack(calculateAttack())}</div>
                    <div><label>Calculated Two-Hand Damage: </label>{showDamage()}</div>
            </div>
        </div>
    );
}

export default Calculator;
